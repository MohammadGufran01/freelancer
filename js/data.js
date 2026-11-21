/**
 * Portfolio Data Registry
 * Structured technical project case studies and architectural specifications.
 */

const PORTFOLIO_DATA = {
  projects: {
    "mh-club": {
      id: "mh-club",
      title: "MH Club E-Commerce Platform",
      category: "ecommerce",
      categoryLabel: "E-Commerce / Full-Stack Development",
      stack: ["Python", "Django", "SQL", "HTML5", "CSS3", "JavaScript"],
      overview: "A custom-engineered e-commerce web platform featuring dynamic catalog management, user authentication, session-backed shopping cart, automated order processing, and a dedicated admin operations hub.",
      problemSolved: "Businesses often struggle with sluggish, bloated template stores. MH Club delivers a clean, database-driven architecture with sub-second page loads, secure transaction lifecycles, and frictionless catalog management.",
      features: [
        "Product catalog with category filtration",
        "Full shopping cart & checkout flow",
        "Role-based user authentication & profiles",
        "Transactional order lifecycle management",
        "Custom Django admin panel for stock & inventory",
        "Fully responsive UI across mobile & desktop"
      ],
      architecture: {
        pattern: "Model-View-Template (MVT) with Django ORM & Normalized Relational Database",
        databaseSummary: [
          { table: "auth_user / user_profile", purpose: "Manages customer accounts, hashed credentials, and billing/shipping addresses" },
          { table: "store_category / product", purpose: "Hierarchical product catalog, SKU tracking, pricing, and stock inventory" },
          { table: "cart / cart_item", purpose: "Session and user-bound shopping cart persistence with optimistic locking" },
          { table: "orders / order_item", purpose: "ACID-compliant order capture, payment state flags, and delivery status logs" }
        ],
        security: "Built-in Django CSRF token verification on all POST operations, password hashing with PBKDF2/SHA-256, SQL injection prevention via parameterized ORM queries, and session cookie encryption.",
        keyEndpoints: [
          "POST /api/cart/add/ — Add item to cart with quantity validation",
          "POST /api/checkout/process/ — Transactional order placement with stock deduction",
          "GET /api/orders/history/ — Authenticated customer order audit trail",
          "POST /admin/products/update-stock/ — Operational inventory management"
        ]
      },
      links: {
        github: "https://github.com",
        demoText: "Source & Client Walkthrough Available"
      }
    },

    "smart-food": {
      id: "smart-food",
      title: "Smart Food Donation Directory",
      category: "java-spring",
      categoryLabel: "Social Impact / Full-Stack Development",
      stack: ["Java", "Spring Boot", "Spring MVC", "Thymeleaf", "Hibernate", "MySQL"],
      overview: "An enterprise-grade directory and logistics platform that connects corporate food donors with non-profit NGOs and verified recipients to eliminate food waste through automated donation claiming.",
      problemSolved: "Perishable surplus food is frequently discarded due to fragmented communication. This system establishes a real-time, database-backed registry with strict pickup deadlines and automated claim transitions.",
      features: [
        "Verified donor & charity registration workflows",
        "Perishable food listing with automated expiration tracking",
        "Real-time donation claiming with transactional locks",
        "Pickup verification & status audit trail",
        "Database-driven search & geographic directory",
        "Server-side rendered dynamic Thymeleaf interfaces"
      ],
      architecture: {
        pattern: "Spring Boot Layered Architecture (Controller -> Service -> Repository / Spring Data JPA -> MySQL)",
        databaseSummary: [
          { table: "organizations", purpose: "Verified donor institutions, food banks, NGOs, and contact officers" },
          { table: "food_donations", purpose: "Item specifications, perishable timestamps, quantity servings, and status flags" },
          { table: "donation_claims", purpose: "Locking mechanism binding approved charities to specific pickup windows" },
          { table: "audit_logs", purpose: "Immutable lifecycle log tracking state transitions (Created -> Claimed -> Completed)" }
        ],
        security: "Spring Security authentication with custom UserDetailsService, BCrypt password hashing, CSRF protection, and server-side input sanitation preventing XSS and injection attacks.",
        keyEndpoints: [
          "POST /donations/new — Create food donation listing with pickup SLA",
          "POST /donations/{id}/claim — Transactional claim execution preventing double-booking",
          "GET /donations/active — Dynamic query with expiration filter (Active & Unclaimed)",
          "POST /donations/{id}/verify-pickup — Final completion handshake with verification token"
        ]
      },
      links: {
        github: "https://github.com",
        demoText: "Source & Architecture Walkthrough Available"
      }
    },

    "volunteer-hub": {
      id: "volunteer-hub",
      title: "VolunteerHub Enterprise Platform",
      category: "java-spring",
      categoryLabel: "Volunteer Management / Web Application",
      stack: ["Java", "Spring Boot", "Spring Security", "Hibernate", "MySQL"],
      overview: "A comprehensive volunteer management and event coordination platform equipped with multi-tier role authorization, GPS-verified attendance tracking, and automated cryptographic certificate issuance.",
      problemSolved: "Volunteer organizations struggle with manual attendance fraud and sluggish certificate dispatch. VolunteerHub introduces automated geolocation boundary validation and instant verified PDF credentials.",
      features: [
        "Multi-role security: Admin, Organization, Volunteer",
        "Event creation, capacity caps & volunteer roster management",
        "GPS coordinate-based radius attendance verification",
        "Automated cryptographic certificate generation",
        "Volunteer participation history & impact dashboards",
        "Hibernate ORM data persistence with MySQL"
      ],
      architecture: {
        pattern: "Spring Boot Enterprise Architecture with Spring Security Role-Based Access Control (RBAC)",
        databaseSummary: [
          { table: "app_users / user_roles", purpose: "Role-based credentials enforcing RBAC across admin, org, and volunteer scopes" },
          { table: "events", purpose: "Event details, scheduled timestamps, target coordinates (lat/lng), and allowed geofence radius" },
          { table: "attendance_records", purpose: "GPS check-in logs with client coordinates, calculated geodesic delta, and verification flag" },
          { table: "certificates", purpose: "Unique certificate UUIDs, SHA-256 integrity hash, issuance metadata, and download links" }
        ],
        security: "Method-level security via @PreAuthorize, JWT token verification for stateless operations, role hierarchies (ADMIN > ORG > VOLUNTEER), and cryptographic validation hashes on certificates.",
        keyEndpoints: [
          "POST /api/events/create — Organization endpoint to publish event and set geofence boundaries",
          "POST /api/attendance/check-in — Validates user GPS coordinates against event geofence via Haversine algorithm",
          "GET /api/certificates/verify/{uuid} — Public cryptographic certificate verification endpoint",
          "GET /api/admin/metrics — Global platform overview with active volunteers and completion rates"
        ]
      },
      links: {
        github: "https://github.com",
        demoText: "Source & Technical Overview Available"
      }
    }
  }
};
