const { Event, EventRegistration, Vendor, User } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

// Get all events with filters
exports.getEvents = async (req, res) => {
  try {
    const {
      category,
      eventType,
      status,
      location,
      startDate,
      endDate,
      search,
      myEvents,
      myRegistrations,
      page = 1,
      limit = 10
    } = req.query;

    const where = { isActive: true };
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Filter by category
    if (category) {
      where.category = category;
    }

    // Filter by event type
    if (eventType) {
      where.eventType = eventType;
    }

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Filter by location
    if (location) {
      where.location = { [Op.like]: `%${location}%` };
    }

    // Filter by date range
    if (startDate) {
      where.startDate = { [Op.gte]: new Date(startDate) };
    }
    if (endDate) {
      where.endDate = { [Op.lte]: new Date(endDate) };
    }

    // Search in name and description
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Filter by organizer (my events)
    if (myEvents === 'true' && req.user) {
      const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
      if (vendor) {
        where.organizerId = vendor.id;
      }
    }

    // Build query options
    const queryOptions = {
      where,
      include: [
        {
          model: Vendor,
          as: 'organizer',
          attributes: ['id', 'businessName', 'logoUrl'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email']
            }
          ]
        }
      ],
      order: [['startDate', 'ASC']],
      limit: parseInt(limit),
      offset
    };

    // Filter by registrations (events I registered for)
    if (myRegistrations === 'true' && req.user) {
      const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
      if (vendor) {
        queryOptions.include.push({
          model: EventRegistration,
          as: 'registrations',
          where: { vendorId: vendor.id },
          required: true
        });
      }
    }

    const { count, rows: events } = await Event.findAndCountAll(queryOptions);

    // If user is logged in, add registration status for each event
    if (req.user) {
      const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
      if (vendor) {
        for (let event of events) {
          const registration = await EventRegistration.findOne({
            where: {
              eventId: event.id,
              vendorId: vendor.id
            }
          });
          event.dataValues.myRegistration = registration || null;
        }
      }
    }

    res.json({
      success: true,
      data: events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message
    });
  }
};

// Get single event by ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findOne({
      where: { id, isActive: true },
      include: [
        {
          model: Vendor,
          as: 'organizer',
          attributes: ['id', 'businessName', 'logoUrl', 'businessDescription', 'username'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email', 'phone']
            }
          ]
        },
        {
          model: EventRegistration,
          as: 'registrations',
          where: { status: { [Op.in]: ['confirmed', 'pending', 'attended'] } },
          required: false,
          include: [
            {
              model: Vendor,
              as: 'vendor',
              attributes: ['id', 'businessName', 'logoUrl', 'businessDescription', 'username']
            }
          ]
        }
      ]
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Separate confirmed vendors (for public display) and pending registrations (for admin)
    const allRegistrations = event.registrations || [];
    const confirmedVendors = allRegistrations
      .filter(r => r.status === 'confirmed' || r.status === 'attended')
      .map(r => r.vendor);
    const pendingRegistrations = allRegistrations.filter(r => r.status === 'pending');

    // Add confirmed vendors list for public display
    event.dataValues.participatingVendors = confirmedVendors;
    
    // If user is admin, include pending registrations for approval
    if (req.user && req.user.role === 'admin') {
      event.dataValues.pendingRegistrations = pendingRegistrations;
    }

    // If user is logged in, add registration status
    if (req.user) {
      const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
      if (vendor) {
        const registration = await EventRegistration.findOne({
          where: {
            eventId: event.id,
            vendorId: vendor.id
          }
        });
        event.dataValues.myRegistration = registration || null;
      }
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event',
      error: error.message
    });
  }
};

// Create new event
exports.createEvent = async (req, res) => {
  try {
    // Only admins can create events
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create events'
      });
    }

    const {
      name,
      description,
      category,
      eventType,
      location,
      virtualLink,
      startDate,
      endDate,
      registrationDeadline,
      maxCapacity,
      requirements,
      status = 'draft',
      visibility = 'public',
      tags,
      schedule
    } = req.body;

    // Validate required fields
    if (!name || !description || !category || !eventType || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const regDeadline = registrationDeadline ? new Date(registrationDeadline) : null;

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    if (regDeadline && regDeadline >= start) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline must be before start date'
      });
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    // Handle banner image upload
    let bannerImage = null;
    if (req.file) {
      bannerImage = `/uploads/events/${req.file.filename}`;
    }

    // Create event
    const event = await Event.create({
      name,
      slug,
      description,
      category,
      eventType,
      location,
      virtualLink,
      startDate,
      endDate,
      registrationDeadline,
      maxCapacity: maxCapacity || null,
      currentParticipants: 0,
      requirements,
      bannerImage,
      status,
      visibility,
      organizerId: null, // No specific organizer - any vendor can register
      tags: tags ? JSON.parse(tags) : [],
      schedule: schedule ? JSON.parse(schedule) : null
    });

    // Fetch created event with organizer info
    const createdEvent = await Event.findByPk(event.id, {
      include: [
        {
          model: Vendor,
          as: 'organizer',
          attributes: ['id', 'businessName', 'logoUrl']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: createdEvent
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message
    });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Only admins can update events
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update events'
      });
    }

    // Find event
    const event = await Event.findOne({
      where: { id, isActive: true }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const {
      name,
      description,
      category,
      eventType,
      location,
      virtualLink,
      startDate,
      endDate,
      registrationDeadline,
      maxCapacity,
      requirements,
      status,
      visibility,
      tags,
      schedule
    } = req.body;

    // Validate dates if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end <= start) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date'
        });
      }
    }

    if (registrationDeadline && (startDate || event.startDate)) {
      const regDeadline = new Date(registrationDeadline);
      const start = new Date(startDate || event.startDate);
      if (regDeadline >= start) {
        return res.status(400).json({
          success: false,
          message: 'Registration deadline must be before start date'
        });
      }
    }

    // Handle banner image upload
    if (req.file) {
      // Delete old banner if exists
      if (event.bannerImage) {
        const oldImagePath = path.join(__dirname, '../../', event.bannerImage);
        try {
          await unlinkAsync(oldImagePath);
        } catch (err) {
          console.error('Error deleting old banner:', err);
        }
      }
      event.bannerImage = `/uploads/events/${req.file.filename}`;
    }

    // Update fields
    if (name) {
      event.name = name;
      event.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }
    if (description) event.description = description;
    if (category) event.category = category;
    if (eventType) event.eventType = eventType;
    if (location) event.location = location;
    if (virtualLink !== undefined) event.virtualLink = virtualLink;
    if (startDate) event.startDate = startDate;
    if (endDate) event.endDate = endDate;
    if (registrationDeadline !== undefined) event.registrationDeadline = registrationDeadline;
    if (maxCapacity !== undefined) event.maxCapacity = maxCapacity;
    if (requirements !== undefined) event.requirements = requirements;
    if (status) event.status = status;
    if (visibility) event.visibility = visibility;
    if (tags) event.tags = JSON.parse(tags);
    if (schedule) event.schedule = JSON.parse(schedule);

    await event.save();

    // Fetch updated event with organizer info
    const updatedEvent = await Event.findByPk(event.id, {
      include: [
        {
          model: Vendor,
          as: 'organizer',
          attributes: ['id', 'businessName', 'logoUrl']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message
    });
  }
};

// Delete event (hard delete - permanently removes from database)
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Only admins can delete events
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete events'
      });
    }

    // Find event
    const event = await Event.findOne({
      where: { id, isActive: true }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Delete banner image if exists
    if (event.bannerImage) {
      const imagePath = path.join(__dirname, '../../', event.bannerImage);
      try {
        if (fs.existsSync(imagePath)) {
          await unlinkAsync(imagePath);
        }
      } catch (err) {
        console.error('Error deleting banner image:', err);
      }
    }

    // Hard delete - permanently remove from database
    // Associated registrations will be automatically deleted due to CASCADE constraint
    await event.destroy();

    res.json({
      success: true,
      message: 'Event permanently deleted from database'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message
    });
  }
};

// Register for event
exports.registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    // Check if user is a vendor
    const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
    if (!vendor) {
      return res.status(403).json({
        success: false,
        message: 'Only vendors can register for events'
      });
    }

    // Find event
    const event = await Event.findOne({
      where: { id, isActive: true }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if event is published
    if (event.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Cannot register for unpublished events'
      });
    }

    // Check registration deadline
    if (event.registrationDeadline && new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed'
      });
    }

    // Check if already registered
    const existingRegistration = await EventRegistration.findOne({
      where: {
        eventId: event.id,
        vendorId: vendor.id
      }
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // All registrations start as pending - admin must approve
    const registrationStatus = 'pending';

    // Create registration with pending status
    const registration = await EventRegistration.create({
      eventId: event.id,
      vendorId: vendor.id,
      status: registrationStatus,
      registrationDate: new Date(),
      notes
    });

    // Participant count will only be updated when admin approves (in approveRegistration function)
    // Do not increment here since registration is pending

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully! Waiting for admin approval.',
      data: registration
    });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register for event',
      error: error.message
    });
  }
};

// Unregister from event
exports.unregisterFromEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is a vendor
    const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
    if (!vendor) {
      return res.status(403).json({
        success: false,
        message: 'Only vendors can unregister from events'
      });
    }

    // Find event
    const event = await Event.findOne({
      where: { id, isActive: true }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Find registration
    const registration = await EventRegistration.findOne({
      where: {
        eventId: event.id,
        vendorId: vendor.id
      }
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'You are not registered for this event'
      });
    }

    // Check if event has already started
    if (new Date() > new Date(event.startDate)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot unregister from an event that has already started'
      });
    }

    // Update registration status
    const wasConfirmed = registration.status === 'confirmed';
    registration.status = 'cancelled';
    await registration.save();

    // Update participant count and promote from waitlist
    if (wasConfirmed) {
      event.currentParticipants -= 1;
      await event.save();

      // Check if there's someone on the waitlist to promote
      const waitlistRegistration = await EventRegistration.findOne({
        where: {
          eventId: event.id,
          status: 'waitlist'
        },
        order: [['registrationDate', 'ASC']]
      });

      if (waitlistRegistration) {
        waitlistRegistration.status = 'confirmed';
        await waitlistRegistration.save();
        event.currentParticipants += 1;
        await event.save();
      }
    }

    res.json({
      success: true,
      message: 'Successfully unregistered from event'
    });
  } catch (error) {
    console.error('Unregister from event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unregister from event',
      error: error.message
    });
  }
};

// Submit feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, feedback } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if user is a vendor
    const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
    if (!vendor) {
      return res.status(403).json({
        success: false,
        message: 'Only vendors can submit feedback'
      });
    }

    // Find event
    const event = await Event.findOne({
      where: { id, isActive: true }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Find registration
    const registration = await EventRegistration.findOne({
      where: {
        eventId: event.id,
        vendorId: vendor.id
      }
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'You did not register for this event'
      });
    }

    // Check if event has ended
    if (new Date() < new Date(event.endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot submit feedback before event ends'
      });
    }

    // Update registration with feedback
    registration.rating = rating;
    registration.feedback = feedback;
    registration.status = 'attended';
    await registration.save();

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: registration
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message
    });
  }
};

// Get event analytics
exports.getEventAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is a vendor
    const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
    if (!vendor) {
      return res.status(403).json({
        success: false,
        message: 'Only vendors can view analytics'
      });
    }

    // Find event
    const event = await Event.findOne({
      where: { id, isActive: true }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is the organizer
    if (event.organizerId !== vendor.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the event organizer can view analytics'
      });
    }

    // Get registration statistics
    const registrations = await EventRegistration.findAll({
      where: { eventId: event.id }
    });

    const analytics = {
      totalRegistrations: registrations.length,
      confirmedCount: registrations.filter(r => r.status === 'confirmed').length,
      waitlistCount: registrations.filter(r => r.status === 'waitlist').length,
      cancelledCount: registrations.filter(r => r.status === 'cancelled').length,
      attendedCount: registrations.filter(r => r.status === 'attended').length,
      currentParticipants: event.currentParticipants,
      maxCapacity: event.maxCapacity,
      capacityPercentage: event.maxCapacity 
        ? (event.currentParticipants / event.maxCapacity * 100).toFixed(2)
        : null,
      ratings: registrations
        .filter(r => r.rating !== null)
        .map(r => r.rating),
      averageRating: registrations
        .filter(r => r.rating !== null)
        .reduce((sum, r) => sum + r.rating, 0) / 
        registrations.filter(r => r.rating !== null).length || 0,
      feedbackCount: registrations.filter(r => r.feedback).length
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get event analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event analytics',
      error: error.message
    });
  }
};

// Approve registration
exports.approveRegistration = async (req, res) => {
  try {
    const { eventId, registrationId } = req.params;

    // Find the registration
    const registration = await EventRegistration.findOne({
      where: { 
        id: registrationId,
        eventId: eventId
      },
      include: [
        {
          model: Vendor,
          as: 'vendor',
          attributes: ['id', 'businessName'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['email', 'firstName', 'lastName']
          }]
        }
      ]
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    if (registration.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Registration is already ${registration.status}`
      });
    }

    // Find event to check capacity
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if event is full
    if (event.maxCapacity && event.currentParticipants >= event.maxCapacity) {
      return res.status(400).json({
        success: false,
        message: 'Event has reached maximum capacity'
      });
    }

    // Approve registration
    registration.status = 'confirmed';
    await registration.save();

    // Update event participant count
    event.currentParticipants += 1;
    await event.save();

    res.json({
      success: true,
      message: 'Registration approved successfully',
      data: registration
    });
  } catch (error) {
    console.error('Approve registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve registration',
      error: error.message
    });
  }
};

// Reject registration
exports.rejectRegistration = async (req, res) => {
  try {
    const { eventId, registrationId } = req.params;
    const { reason } = req.body;

    // Find the registration
    const registration = await EventRegistration.findOne({
      where: { 
        id: registrationId,
        eventId: eventId
      },
      include: [
        {
          model: Vendor,
          as: 'vendor',
          attributes: ['id', 'businessName'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['email', 'firstName', 'lastName']
          }]
        }
      ]
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    if (registration.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Registration is already ${registration.status}`
      });
    }

    // Update registration
    registration.status = 'cancelled';
    if (reason) {
      registration.notes = reason;
    }
    await registration.save();

    res.json({
      success: true,
      message: 'Registration rejected successfully',
      data: registration
    });
  } catch (error) {
    console.error('Reject registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject registration',
      error: error.message
    });
  }
};
