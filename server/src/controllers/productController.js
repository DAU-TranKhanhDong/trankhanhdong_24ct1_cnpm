import pool from '../config/db.js';

/**
 * Lấy danh sách sản phẩm từ MySQL (giadungsmart.products)
 */
export const getProducts = async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({ success: false, message: 'MySQL chưa kết nối' });
    }

    const { category, search } = req.query;
    let query = `
      SELECT p.*, c.name AS category_name, b.name AS brand_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.status != 'inactive'
    `;
    const params = [];

    if (category && category !== 'all') {
      query += ` AND p.category_id = ?`;
      params.push(category);
    }

    if (search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY p.featured DESC, p.id ASC`;

    const [rows] = await pool.query(query, params);

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('❌ Lỗi lấy sản phẩm từ MySQL:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Lấy chi tiết 1 sản phẩm kèm hình ảnh & thông số kỹ thuật
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!pool) {
      return res.status(503).json({ success: false, message: 'MySQL chưa kết nối' });
    }

    const [products] = await pool.query(
      `SELECT p.*, c.name AS category_name, b.name AS brand_name 
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN brands b ON p.brand_id = b.id
       WHERE p.id = ?`,
      [id]
    );

    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    const product = products[0];

    // Lấy thêm hình ảnh chi tiết
    const [images] = await pool.query(
      'SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC',
      [id]
    );
    product.images = images.map(img => img.image_url);

    // Lấy thông số kỹ thuật
    const [specs] = await pool.query(
      'SELECT spec_key, spec_value FROM product_specifications WHERE product_id = ? ORDER BY sort_order ASC',
      [id]
    );
    product.specifications = specs;

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Lấy danh mục sản phẩm từ MySQL (giadungsmart.categories)
 */
export const getCategories = async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({ success: false, message: 'MySQL chưa kết nối' });
    }

    const [rows] = await pool.query('SELECT * FROM categories ORDER BY sort_order ASC');
    return res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
