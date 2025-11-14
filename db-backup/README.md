# Database Backup & Restore

This directory contains JSON backup files for the Skill Exchange database. These files can be used for offline data access, testing, or disaster recovery.

## 📁 Backup Files

- **users.json** - User profiles and account data
- **courses.json** - Course information and metadata
- **modules.json** - Course modules and lessons
- **notifications.json** - User notifications
- **reviews.json** - Course reviews and ratings

## 🔄 Export Real Data from Database

To backup your current database data to these JSON files:

```powershell
# From the Back-End directory
node export-real-data.js
```

This will:

- Connect to your MongoDB database
- Export all collections to JSON files
- Save them in this `db-backup` folder
- Exclude sensitive data (passwords are automatically removed)

## 📊 What Gets Exported

The export script (`export-real-data.js`) exports:

| Collection    | Description                      | Password Excluded |
| ------------- | -------------------------------- | ----------------- |
| users         | User profiles, skills, points    | ✅ Yes            |
| courses       | Course details, pricing, ratings | N/A               |
| modules       | Course modules and lessons       | N/A               |
| notifications | User notifications               | N/A               |
| reviews       | Course reviews and ratings       | N/A               |

## 🛠️ Usage

### Manual Backup

```bash
cd Back-End
node export-real-data.js
```

### Scheduled Backup (Optional)

You can schedule regular backups using:

**Windows Task Scheduler:**

```powershell
# Create a task that runs daily
$action = New-ScheduledTaskAction -Execute "node" -Argument "C:\path\to\Back-End\export-real-data.js"
$trigger = New-ScheduledTaskTrigger -Daily -At 2am
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "SkillExchangeBackup"
```

**Linux/Mac Cron:**

```bash
# Add to crontab (runs daily at 2am)
0 2 * * * cd /path/to/Back-End && node export-real-data.js
```

## 📝 File Format

All files are in JSON array format:

```json
[
  {
    "_id": "...",
    "field1": "value1",
    "field2": "value2"
  }
]
```

## ⚠️ Important Notes

### Security

- **Do NOT commit sensitive data** to version control
- The export script automatically excludes passwords
- Review files before sharing or committing

### Data Privacy

- Exported data contains real user information
- Handle with appropriate security measures
- Consider anonymizing data for development/testing

### File Size

- Large databases will create large JSON files
- Monitor disk space usage
- Consider compressing old backups

## 🔧 Customizing Exports

To export additional collections, edit `Back-End/export-real-data.js`:

```javascript
// Add your model
const MyModel = require("./models/mymodel.model");

// Add export logic
console.log("📦 Exporting my collection...");
const myData = await MyModel.find({}).lean();
fs.writeFileSync(
  path.join(backupDir, "mycollection.json"),
  JSON.stringify(myData, null, 2)
);
console.log(`✅ Exported ${myData.length} items`);
```

## 📈 Backup Strategy

### Recommended Approach

1. **Daily Exports** - Run export script daily
2. **Version Old Backups** - Keep last 7 days of backups
3. **Off-site Storage** - Store critical backups remotely
4. **Test Restores** - Regularly verify backup integrity

### Example Versioned Backup

```powershell
# Create timestamped backup
$timestamp = Get-Date -Format "yyyy-MM-dd"
node export-real-data.js
Compress-Archive -Path db-backup/*.json -DestinationPath "backups/backup-$timestamp.zip"
```

## 🔄 Restoring Data

If you need to restore data to your database, you can use MongoDB's `mongoimport`:

```powershell
# Restore users collection
mongoimport --uri="your-mongo-uri" --collection=users --file=users.json --jsonArray

# Restore all collections
mongoimport --uri="your-mongo-uri" --collection=users --file=users.json --jsonArray
mongoimport --uri="your-mongo-uri" --collection=courses --file=courses.json --jsonArray
mongoimport --uri="your-mongo-uri" --collection=modules --file=modules.json --jsonArray
```

Or create a restore script similar to `export-real-data.js`.

## 📞 Support

If you encounter issues:

- Check MongoDB connection string in `.env`
- Verify all model files exist in `Back-End/models/`
- Ensure write permissions for this directory
- Check Node.js console for error messages

## 📄 License

These backup files are part of the Skill Exchange project and should be handled according to your project's license and data privacy policies.

---

**Last Updated:** November 14, 2025  
**Script Location:** `Back-End/export-real-data.js`
