# CRL Digital Filing System

A modern, 3D-themed web-based document management system for CRLD division records with advanced search, filtering, and access control features.

## Features

### 🔐 Authentication & Security
- **Secure Login System** with username/password authentication
- **OTP Email Verification** for enhanced security
- **Role-Based Access Control** (Admin, Manager, User, Viewer)
- **Granular Permissions** (View, Edit, Upload, Delete, Print)

### 📁 Document Management
- **Multi-Company Support**: LOYOLA, CARITAS, PPLIC, ETERNAL
- **Hierarchical Categories**: Organized folder structure with main and sub-categories
- **PDF Document Upload**: Support for multiple file uploads
- **Metadata Management**: AO Name, Year, Month, Scanned Date, Storage Location
- **Automatic Page Counting**: PDF page count extraction
- **File Organization**: Physical storage location tracking

### 🔍 Advanced Search & Filter
- **Full-Text Search**: Search by filename, description, or AO name
- **Multi-Filter System**: Filter by company, category, year, and month
- **Real-Time Results**: Instant filtering without page reload

### 📊 Reports & Analytics
- **Comprehensive Reports**: Detailed document statistics
- **Export Functionality**: CSV export for Excel analysis
- **Dashboard Analytics**: Visual statistics and recent uploads
- **Activity Logging**: Track all user actions

### ♻️ Recycle Bin
- **Soft Delete**: Documents moved to recycle bin before permanent deletion
- **Restore Capability**: Recover accidentally deleted documents
- **Permanent Delete**: Remove documents permanently when needed

### 👥 User Management
- **User CRUD Operations**: Create, Read, Update users
- **Permission Management**: Customize access for each user
- **Activity Tracking**: Monitor user actions and logins

### 🎨 Modern UI/UX
- **3D Glass Morphism Design**: Beautiful dark pastel theme
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Professional transitions and effects
- **Intuitive Navigation**: Easy-to-use sidebar and dashboard

## Technology Stack

### Backend
- **Python 3.x**: Core programming language
- **Flask**: Web framework
- **PyMySQL**: MySQL database connector
- **Flask-Login**: User session management
- **Flask-Mail**: Email functionality for OTP
- **PyPDF2**: PDF page counting
- **Werkzeug**: Security utilities

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Advanced styling with animations
- **JavaScript**: Interactive functionality
- **jQuery**: AJAX and DOM manipulation
- **Font Awesome 6**: Icon library

### Database
- **MySQL/MariaDB**: Relational database (via XAMPP)

## Installation Guide

### Prerequisites
1. **XAMPP** (or standalone MySQL/MariaDB server)
2. **Python 3.7+**
3. **pip** (Python package manager)
4. **Web browser** (Chrome, Firefox, Edge, Safari)

### Step 1: Install XAMPP
1. Download XAMPP from https://www.apachefriends.org/
2. Install XAMPP and start Apache and MySQL services
3. Access phpMyAdmin at http://localhost/phpmyadmin

### Step 2: Setup Database
1. Open phpMyAdmin in your browser
2. Click "Import" tab
3. Choose file: `database/schema.sql`
4. Click "Go" to import the database structure
5. The database `crl_filing_system` will be created with all tables

**Default Admin Credentials:**
- Username: `admin`
- Email: `admin@crl.com`
- Password: `admin123` (⚠️ Change this immediately after first login!)

### Step 3: Install Python Dependencies
```bash
cd crl_filing_system
pip install flask flask-login flask-mail pymysql werkzeug python-dotenv PyPDF2
```

### Step 4: Configure Environment Variables
Create a `.env` file in the project root:

```env
# Flask Configuration
SECRET_KEY=your-secret-key-here-change-this
FLASK_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=crl_filing_system

# Email Configuration (for OTP)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_DEFAULT_SENDER=noreply@crl.com
```

### Step 5: Configure Email for OTP
For Gmail:
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password
3. Use this App Password in MAIL_PASSWORD in `.env`

### Step 6: Run the Application
```bash
python app.py
```

The application will start on http://localhost:5000

### Step 7: First Login
1. Navigate to http://localhost:5000
2. Login with default admin credentials
3. An OTP will be sent to the configured email
4. Enter the OTP to complete login
5. Change the admin password immediately

## Directory Structure

```
crl_filing_system/
├── app.py                      # Main Flask application
├── requirements.txt            # Python dependencies
├── README.md                   # This file
├── .env                        # Environment variables (create this)
├── database/
│   └── schema.sql             # Database schema
├── static/
│   ├── css/
│   │   └── style.css          # Main stylesheet (3D theme)
│   ├── js/
│   │   └── (future JS files)
│   ├── images/
│   │   └── (logos, icons)
│   └── uploads/               # Uploaded documents stored here
└── templates/
    ├── base.html              # Base template
    ├── login.html             # Login page
    ├── verify_otp.html        # OTP verification
    ├── dashboard.html         # Main dashboard
    ├── documents.html         # Document listing
    ├── upload.html            # Upload interface
    ├── recycle_bin.html       # Deleted documents
    ├── reports.html           # Document reports
    └── users.html             # User management
```

## Document Categories

The system includes pre-configured categories:

### Main Folders
1. **Quarterly Reports**
2. **IC Reply Letters**
3. **Incoming & Outgoing Communications**
   - Company letters and IC responses
   - Communications related to rehabilitation, liquidation, and distribution plans
   - Servicing plan correspondence
   - Closure and Termination of Liquidation Proceedings
   - Miscellaneous IC and company letters
4. **Examination & Verification**
   - Annual Statement and Audited Financial Statements
   - IC transmittal letters
   - Working balance sheets, schedules, and supporting documents
   - Office orders and designation letters
5. **Claims**
   - Walk-in claimant request/Claimants Request for Assistance
   - Claims filed directly to CRLD through email
   - Court-related cases
6. **Bank/Financial Statements**
   - Monthly Statements
   - Bank Statements
7. **Division Files**
   - Appointment Papers
   - Minutes of Meeting
   - Administrative Matters
   - Other important documents

## User Roles & Permissions

### Admin
- Full system access
- Manage users
- All document operations
- Access all reports

### Manager
- View user list
- All document operations
- Access all reports
- Cannot modify users

### User
- Upload documents (if permitted)
- View documents (if permitted)
- Edit documents (if permitted)
- Delete documents (if permitted)

### Viewer
- View-only access
- Can print/download (if permitted)
- No upload/edit/delete capabilities

## Usage Guide

### Uploading Documents
1. Navigate to **Upload** page
2. Select Company and Category
3. Fill in document metadata (AO Name, Year, Month, etc.)
4. Drag & drop PDF files or click to browse
5. Click **Upload Documents**

### Searching Documents
1. Use the search bar on Documents page
2. Type filename, description, or AO name
3. Results update automatically

### Filtering Documents
1. Use dropdown filters for:
   - Company
   - Category
   - Year
   - Month
2. Filters can be combined
3. Click "Clear Filters" to reset

### Managing Users (Admin only)
1. Navigate to **User Settings**
2. Click **Add New User**
3. Fill in user details
4. Select role and permissions
5. Click **Create User**

To edit permissions:
1. Click edit icon next to user
2. Modify role and permissions
3. Click **Save Changes**

### Using Recycle Bin
1. Navigate to **Recycle Bin**
2. View all deleted documents
3. Click **Restore** to recover a document
4. Click **Delete Permanently** to remove forever

### Generating Reports
1. Navigate to **Reports**
2. View comprehensive document statistics
3. Click **Export to Excel** for CSV download
4. Open in Excel/Google Sheets for analysis

## Security Best Practices

1. **Change Default Password**: Immediately change admin password after installation
2. **Use Strong Passwords**: Enforce strong password policy
3. **Regular Backups**: Backup database and uploaded files regularly
4. **SSL Certificate**: Use HTTPS in production
5. **Restrict Access**: Limit database access to localhost
6. **Update Dependencies**: Keep Python packages updated
7. **Monitor Logs**: Review user activity logs regularly
8. **File Permissions**: Ensure upload directory has proper permissions

## Backup & Restore

### Database Backup
```bash
mysqldump -u root -p crl_filing_system > backup_$(date +%Y%m%d).sql
```

### File Backup
```bash
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz static/uploads/
```

### Restore Database
```bash
mysql -u root -p crl_filing_system < backup_20240101.sql
```

## Troubleshooting

### OTP Email Not Sending
- Check MAIL_USERNAME and MAIL_PASSWORD in `.env`
- Verify Gmail App Password is correct
- Check if SMTP port 587 is open
- Review Flask console for error messages

### Database Connection Error
- Ensure MySQL is running in XAMPP
- Verify DB_HOST, DB_USER, DB_PASSWORD in `.env`
- Check if database exists in phpMyAdmin
- Test connection with phpMyAdmin

### Upload Fails
- Check upload folder permissions (should be writable)
- Verify MAX_CONTENT_LENGTH in app.py (default 50MB)
- Ensure file is PDF format
- Check available disk space

### 404 Page Not Found
- Verify Flask is running on http://localhost:5000
- Check for Python errors in console
- Ensure all templates exist in templates/ folder

## Performance Optimization

1. **Database Indexing**: Already configured in schema.sql
2. **File Compression**: Consider PDF compression for large files
3. **Caching**: Implement Flask-Caching for frequently accessed data
4. **CDN**: Use CDN for Font Awesome and jQuery in production
5. **Database Tuning**: Optimize MySQL configuration for your hardware

## Future Enhancements

- [ ] Document versioning system
- [ ] Advanced OCR for searchable PDFs
- [ ] Real-time notifications
- [ ] Mobile app
- [ ] Integration with cloud storage
- [ ] Advanced analytics dashboard
- [ ] Bulk operations
- [ ] Document preview
- [ ] API endpoints for third-party integration
- [ ] Multi-language support

## Support

For issues or questions:
1. Check this documentation
2. Review error messages in console
3. Check database logs in XAMPP
4. Verify all configuration in `.env`

## License

Copyright © 2024 CRL. All rights reserved.

## Credits

- **Design**: Modern 3D Glass Morphism with Dark Pastel Theme
- **Icons**: Font Awesome 6
- **Framework**: Flask (Python)
- **Database**: MySQL/MariaDB

---

**Version**: 1.0.0
**Last Updated**: 2024
**Developed for**: CRL Division Document Records Management


