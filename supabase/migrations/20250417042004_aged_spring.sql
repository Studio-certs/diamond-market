/*
  # Add sample data for diamonds

  1. Sample Data Added
    - Individual Diamonds: 6 high-quality diamonds with varying characteristics
    - Wholesale Diamonds: 4 wholesale listings with different specifications

  2. Data Characteristics
    - Realistic pricing and specifications
    - Variety of colors, cuts, and clarities
    - Representative of actual market offerings
*/

-- Insert sample individual diamonds
INSERT INTO individual_diamonds (name, description, price, carat, color, clarity, cut, image_url) VALUES
(
  'Pristine Round Brilliant',
  'An exceptional round brilliant cut diamond featuring exceptional fire and brilliance. Perfect for engagement rings.',
  15800.00,
  1.5,
  'D',
  'VVS1',
  'Excellent',
  'https://images.unsplash.com/photo-1600267185393-e158a98703de?w=800&auto=format&fit=crop'
),
(
  'Royal Blue Princess',
  'A stunning princess cut diamond with perfect proportions and exceptional clarity.',
  12500.00,
  1.2,
  'F',
  'VS1',
  'Excellent',
  'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=800&auto=format&fit=crop'
),
(
  'Emerald Excellence',
  'A sophisticated emerald cut diamond with remarkable step cuts and clarity.',
  18900.00,
  1.8,
  'E',
  'VVS2',
  'Very Good',
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop'
),
(
  'Oval Perfection',
  'An oval cut diamond that combines classic elegance with modern brilliance.',
  21500.00,
  2.0,
  'D',
  'IF',
  'Excellent',
  'https://images.unsplash.com/photo-1603255466024-2c0802dc5c08?w=800&auto=format&fit=crop'
),
(
  'Cushion Classic',
  'A beautiful cushion cut diamond with exceptional fire and scintillation.',
  16700.00,
  1.6,
  'G',
  'VS2',
  'Very Good',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop'
),
(
  'Radiant Romance',
  'A radiant cut diamond featuring outstanding brilliance and fire.',
  19200.00,
  1.75,
  'F',
  'VS1',
  'Excellent',
  'https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=800&auto=format&fit=crop'
);

-- Insert sample wholesale diamonds
INSERT INTO wholesale_diamonds (
  name,
  description,
  base_price_per_carat,
  minimum_carat,
  maximum_carat,
  color,
  clarity,
  cut,
  available_quantity,
  minimum_order_quantity,
  bulk_discount_percentage,
  image_url
) VALUES
(
  'Premium Round Brilliant Collection',
  'A curated collection of round brilliant diamonds perfect for luxury jewelry collections.',
  3500.00,
  0.5,
  2.0,
  'F',
  'VS2',
  'Excellent',
  50,
  10,
  15.0,
  'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=800&auto=format&fit=crop'
),
(
  'Princess Cut Wholesale Package',
  'High-quality princess cut diamonds ideal for engagement ring collections.',
  2800.00,
  0.3,
  1.5,
  'G',
  'VS1',
  'Very Good',
  75,
  15,
  12.5,
  'https://images.unsplash.com/photo-1600267185393-e158a98703de?w=800&auto=format&fit=crop'
),
(
  'Emerald Cut Bulk Selection',
  'Premium emerald cut diamonds for luxury jewelry manufacturers.',
  4200.00,
  1.0,
  3.0,
  'D',
  'VVS2',
  'Excellent',
  30,
  5,
  18.0,
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop'
),
(
  'Mixed Cut Value Package',
  'A diverse selection of various diamond cuts for versatile inventory needs.',
  2500.00,
  0.25,
  1.0,
  'H',
  'SI1',
  'Good',
  100,
  20,
  20.0,
  'https://images.unsplash.com/photo-1603255466024-2c0802dc5c08?w=800&auto=format&fit=crop'
);