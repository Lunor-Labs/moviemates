
import { Guest, GuestStatus } from '../types';

/**
 * ONE-TIME STATUS UPDATE GOOGLE APPS SCRIPT TEMPLATE
 * 1. Open your Google Sheet
 * 2. Extensions > Apps Script
 * 3. Replace EVERYTHING in the editor with this code:
 *
 * function doGet() {
 *   try {
 *     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *     const data = sheet.getDataRange().getValues();
 *     if (data.length < 1) return createJsonOutput([]);
 *
 *     const headers = data[0].map(h => h.toString().toLowerCase().trim());
 *     const guests = data.slice(1)
 *       .filter(row => row[0] !== "")
 *       .map((row, index) => {
 *         let obj = { id: (index + 2).toString() };
 *         headers.forEach((header, i) => {
 *           if (header) obj[header] = row[i];
 *         });
 *         // Add locked status for confirmed guests
 *         obj.locked = obj.status === 'confirmed';
 *         return obj;
 *       });
 *     return createJsonOutput(guests);
 *   } catch (e) {
 *     return createJsonOutput({ error: e.toString() });
 *   }
 * }
 *
 * function doPost(e) {
 *   try {
 *     if (!e.postData || !e.postData.contents) {
 *       return createJsonOutput({ success: false, error: "No post data" });
 *     }
 *
 *     const params = JSON.parse(e.postData.contents);
 *     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *     const row = parseInt(params.id);
 *
 *     if (isNaN(row)) return createJsonOutput({ success: false, error: "Invalid ID/Row" });
 *
 *     const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
 *       .map(h => h.toString().toLowerCase().trim());
 *
 *     const statusCol = headers.indexOf('status') + 1;
 *     if (statusCol > 0) {
 *       // Check current status - if already confirmed, prevent changes
 *       const currentStatus = sheet.getRange(row, statusCol).getValue().toString().toLowerCase();
 *
 *       if (currentStatus === 'confirmed') {
 *         return createJsonOutput({ success: false, error: "Status already confirmed and cannot be changed" });
 *       }
 *
 *       // Only allow status updates if not already confirmed
 *       if (params.status.toLowerCase() === 'confirmed') {
 *         sheet.getRange(row, statusCol).setValue('confirmed');
 *         return createJsonOutput({ success: true, locked: true });
 *       } else if (params.status.toLowerCase() === 'pending') {
 *         sheet.getRange(row, statusCol).setValue('pending');
 *         return createJsonOutput({ success: true, locked: false });
 *       } else {
 *         return createJsonOutput({ success: false, error: "Invalid status value" });
 *       }
 *     }
 *     return createJsonOutput({ success: false, error: "Status column not found" });
 *   } catch (e) {
 *     return createJsonOutput({ success: false, error: e.toString() });
 *   }
 * }
 *
 * function createJsonOutput(data) {
 *   return ContentService.createTextOutput(JSON.stringify(data))
 *     .setMimeType(ContentService.MimeType.JSON);
 * }
 *
 * IMPORTANT:
 * - Click 'Deploy' > 'New Deployment'
 * - Select 'Web App'
 * - Set 'Execute as' to 'Me'
 * - Set 'Who has access' to 'Anyone'
 * - This script enforces ONE-TIME status updates (CONFIRMED status cannot be changed)
 */

export const fetchGuests = async (scriptUrl: string): Promise<Guest[]> => {
  if (!scriptUrl) throw new Error('No Script URL provided');
  
  const response = await fetch(scriptUrl);
  
  if (!response.ok) {
    throw new Error(`Connection Error: ${response.status}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(`Apps Script Error: ${data.error}`);
  }
  
  return data;
};

export const updateGuestStatus = async (scriptUrl: string, id: string, status: GuestStatus): Promise<void> => {
  if (!scriptUrl) throw new Error('No Script URL provided');
  
  // We use 'text/plain' to trigger a "simple request" that bypasses certain CORS preflights
  // which Google Apps Script handles better in 'no-cors' mode.
  await fetch(scriptUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify({ id, status }),
  });
};
