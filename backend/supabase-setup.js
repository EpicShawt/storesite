// Supabase + Google Sheets Integration
const { createClient } = require('@supabase/supabase-js');
const { google } = require('googleapis');

// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Google Sheets Configuration
const auth = new google.auth.GoogleAuth({
  keyFile: 'google-credentials.json', // We'll create this
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Google Sheets IDs (we'll create these)
const PRODUCTS_SHEET_ID = process.env.GOOGLE_SHEETS_PRODUCTS_ID;
const ORDERS_SHEET_ID = process.env.GOOGLE_SHEETS_ORDERS_ID;
const USERS_SHEET_ID = process.env.GOOGLE_SHEETS_USERS_ID;

// Database Functions
const db = {
  // Products
  async addProduct(product) {
    try {
      // Add to Supabase
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();

      if (error) throw error;

      // Add to Google Sheets
      await sheets.spreadsheets.values.append({
        spreadsheetId: PRODUCTS_SHEET_ID,
        range: 'Products!A:Z',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [[
            data[0].id,
            data[0].name,
            data[0].price,
            data[0].category,
            data[0].description,
            data[0].image_url,
            new Date().toISOString()
          ]]
        }
      });

      return data[0];
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async deleteProduct(id) {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Delete from Google Sheets (mark as deleted)
      await sheets.spreadsheets.values.append({
        spreadsheetId: PRODUCTS_SHEET_ID,
        range: 'DeletedProducts!A:Z',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [[id, new Date().toISOString(), 'DELETED']]
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Orders
  async addOrder(order) {
    try {
      // Add to Supabase
      const { data, error } = await supabase
        .from('orders')
        .insert([order])
        .select();

      if (error) throw error;

      // Add to Google Sheets
      await sheets.spreadsheets.values.append({
        spreadsheetId: ORDERS_SHEET_ID,
        range: 'Orders!A:Z',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [[
            data[0].id,
            data[0].customer_name,
            data[0].customer_email,
            data[0].total_amount,
            data[0].status,
            new Date().toISOString()
          ]]
        }
      });

      return data[0];
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  },

  // Users
  async addUser(user) {
    try {
      // Add to Supabase
      const { data, error } = await supabase
        .from('users')
        .insert([user])
        .select();

      if (error) throw error;

      // Add to Google Sheets
      await sheets.spreadsheets.values.append({
        spreadsheetId: USERS_SHEET_ID,
        range: 'Users!A:Z',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [[
            data[0].id,
            data[0].email,
            data[0].name,
            data[0].role,
            new Date().toISOString()
          ]]
        }
      });

      return data[0];
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  },

  // File Upload (Supabase Storage)
  async uploadFile(file, bucket = 'product-images') {
    try {
      const fileName = `${Date.now()}-${file.originalname}`;
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
};

module.exports = { db, supabase }; 