**Project Title:** Waste Bin Survey App for Android

**Target User:** Municipal waste supervisors and field workers in Glyfada Municipality

**Goal:** To collect and export data about street waste bin locations (Green, Blue, Brown, Yellow) with geolocation, photo, and comments, operating offline and syncing/exporting data when needed.

---

### 1. Features Overview

#### a. Core Features
- GPS-based bin logging
- Dropdown for street selection
- Multi-select bin types (Green, Blue, Brown, Yellow)
- Numeric field for bin quantity
- Optional photo capture
- Optional text comments
- Date/time auto-stamp
- Local storage (SQLite or Room)
- Export to Excel/CSV/GeoJSON

#### b. Offline Mode
- Data can be stored offline
- Export manually when online

#### c. Sync (Phase 2 / Optional)
- Sync with Google Sheets or Drive
- Email export or FTP option

---

### 2. Data Model

| Field               | Type        | Required | Description                         |
|--------------------|-------------|----------|-------------------------------------|
| id                 | UUID        | Yes      | Unique local identifier             |
| datetime           | Timestamp   | Yes      | Auto-generated                      |
| street             | String      | Yes      | Selected from predefined list       |
| latitude           | Float       | Yes      | Captured via GPS                    |
| longitude          | Float       | Yes      | Captured via GPS                    |
| bin_types          | List<String>| Yes      | One or more selected types          |
| quantity           | Integer     | Yes      | Number of bins                      |
| photo_uri          | URI/String  | No       | Local path to photo or base64       |
| comments           | String      | No       | Free text                           |
| synced             | Boolean     | Yes      | Indicates if exported or not        |

---

### 3. Technologies Used
- **Platform:** Android (API 24+)
- **Language:** Kotlin (preferred) or Java
- **Database:** Room (Android Jetpack)
- **UI:** Jetpack Compose or XML Layouts
- **Maps:** Google Maps SDK (optional, Phase 2)
- **Photo:** Android Camera Intent
- **Export:** Apache POI (for .xlsx), CSV Writer

---

### 4. Screen Flow

#### 1. Main Activity
- Button: "New Entry"
- Button: "Export Data"

#### 2. Form Screen
- Dropdown: Select Street
- Checkboxes: Bin Type
- Number Field: Quantity
- Button: Capture Photo
- Text Field: Comments
- Button: Get Location (GPS)
- Button: Submit Entry

#### 3. History Screen (optional)
- List of previous entries
- Status: Synced/Not Synced
- Option to delete/edit/export

---

### 5. Export Format
- **Excel:** With column headers matching Data Model
- **CSV:** UTF-8 encoded
- **GeoJSON:** FeatureCollection with Point geometry

---

### 6. Optional Enhancements
- Authentication (for municipal staff)
- Location snapping to OpenStreetMap roads
- Scheduled backups to SD card
- QR code for street selection

---

### 7. Delivery Milestones (Est.)
| Phase       | Description                          | Time     |
|-------------|--------------------------------------|----------|
| Phase 1     | UI Design + Form + Local DB Storage  | 1.5 weeks|
| Phase 2     | Export + Photo + Offline logic       | 1 week   |
| Phase 3     | Sync + Polish + Delivery             | 1 week   |

