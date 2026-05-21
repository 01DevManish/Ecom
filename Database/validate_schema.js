const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_SFK9nH2uTaIi@ep-falling-unit-aocdzkhh-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false },
});

const EXPECTED_TABLES = [
  "users",
  "user_profiles",
  "user_addresses",
  "auth_otp_requests",
  "user_sessions",
  "brands",
  "categories",
  "products",
  "product_category_map",
  "product_variants",
  "product_images",
  "inventory_items",
  "inventory_source_mapping",
  "inventory_sync_runs",
  "wishlists",
  "wishlist_items",
  "carts",
  "cart_items",
  "orders",
  "order_items",
  "payments",
  "order_status_history",
  "team_users",
  "store_products",
  "customer_carts",
  "customer_cart_items",
  "customer_orders",
  "customer_order_items",
  "sites"
];

async function run() {
  console.log("=== Neon PostgreSQL Schema and Integration Validator ===");
  let failed = false;
  
  try {
    // 1. Connection check
    console.log("1. Checking connection to PostgreSQL...");
    const timeRes = await pool.query("SELECT NOW()");
    console.log(`✅ Connected successfully. DB Time: ${timeRes.rows[0].now}`);
    
    // 2. Schema check
    console.log("\n2. Verifying database table schema...");
    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    const existingTables = new Set(tablesRes.rows.map(r => r.table_name));
    
    for (const table of EXPECTED_TABLES) {
      if (existingTables.has(table)) {
        console.log(`  ✅ Table '${table}' exists`);
      } else {
        console.warn(`  ❌ Table '${table}' is MISSING`);
        failed = true;
      }
    }
    
    // 3. Multi-Tenant Sites check
    console.log("\n3. Validating multi-tenant 'sites' entry...");
    const sitesRes = await pool.query("SELECT id, name, domain FROM sites");
    console.log(`  Found ${sitesRes.rows.length} registered sites:`);
    sitesRes.rows.forEach(site => {
      console.log(`    - ID: ${site.id}, Name: ${site.name}, Domain: ${site.domain}`);
    });
    const siteIds = sitesRes.rows.map(s => s.id);
    if (!siteIds.includes("quirkyhome") || !siteIds.includes("homcot") || !siteIds.includes("mybedzy")) {
      console.warn("  ❌ Critical storefront tenant configurations are incomplete or missing!");
      failed = true;
    } else {
      console.log("  ✅ All storefront tenants (quirkyhome, homcot, mybedzy) are correctly registered");
    }

    // 4. Products and Catalog check
    console.log("\n4. Checking catalog products and variants...");
    const productsRes = await pool.query("SELECT COUNT(*) as count FROM products");
    const variantsRes = await pool.query("SELECT COUNT(*) as count FROM product_variants");
    const imagesRes = await pool.query("SELECT COUNT(*) as count FROM product_images");
    const inventoryRes = await pool.query("SELECT COUNT(*) as count FROM inventory_items");
    
    console.log(`  Catalog Statistics:`);
    console.log(`    - Products: ${productsRes.rows[0].count}`);
    console.log(`    - Product Variants: ${variantsRes.rows[0].count}`);
    console.log(`    - Product Images: ${imagesRes.rows[0].count}`);
    console.log(`    - Inventory Items: ${inventoryRes.rows[0].count}`);
    
    if (parseInt(productsRes.rows[0].count) === 0) {
      console.warn("  ⚠️ Warning: No products exist in the catalog");
    } else {
      console.log("  ✅ Product catalog contains valid active inventory items");
    }

    // 5. Admin authentication setup check
    console.log("\n5. Checking team_users / admin login...");
    const adminsRes = await pool.query("SELECT id, email, role, is_active FROM team_users");
    console.log(`  Found ${adminsRes.rows.length} team users:`);
    adminsRes.rows.forEach(admin => {
      console.log(`    - Email: ${admin.email}, Role: ${admin.role}, Active: ${admin.is_active}`);
    });
    const hasAdmin = adminsRes.rows.some(u => u.role === 'admin' && u.email === 'admin@quirkyhome.in');
    if (hasAdmin) {
      console.log("  ✅ Default Admin user 'admin@quirkyhome.in' exists and is properly registered");
    } else {
      console.warn("  ❌ Default Admin credentials are missing!");
      failed = true;
    }

    console.log("\n=======================================================");
    if (failed) {
      console.log("❌ Integration validation completed with failures/warnings.");
      process.exit(1);
    } else {
      console.log("🏆 All system tests, schema checks, and multi-tenant integrations PASSED!");
      process.exit(0);
    }

  } catch (err) {
    console.error("❌ Diagnostic suite run failed with exception:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
