-- Migration: Add admin management fields
-- Date: 2025-10-04
-- Description: Add status field to users table and status/flagged fields to products table

-- Add status column to users table for customer account management
ALTER TABLE users 
ADD COLUMN status ENUM('active', 'suspended', 'inactive') DEFAULT 'active' 
COMMENT 'Account status for admin management'
AFTER is_active;

-- Add status column to products table for admin moderation
ALTER TABLE products 
ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved' 
COMMENT 'Admin moderation status'
AFTER is_featured;

-- Add flagged column to products table for admin review
ALTER TABLE products 
ADD COLUMN flagged BOOLEAN DEFAULT FALSE 
COMMENT 'Flagged for admin review'
AFTER status;

-- Update existing records to have default values
UPDATE users SET status = 'active' WHERE status IS NULL;
UPDATE products SET status = 'approved' WHERE status IS NULL;
UPDATE products SET flagged = FALSE WHERE flagged IS NULL;

-- Add index for better query performance
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_flagged ON products(flagged);
