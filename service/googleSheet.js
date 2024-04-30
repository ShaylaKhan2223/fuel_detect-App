// import {GoogleSpreadsheet} from 'google-spreadsheet';
// import {JWT} from 'google-auth-library';

// // Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
// const serviceAccountAuth = new JWT({
//   email: 'fuel-tracker@fueltracker-421617.iam.gserviceaccount.com',
//   key: '0016f574f582cb461698cfd9924a20b711fb44e0',
//   //   email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
//   //   key: process.env.GOOGLE_PRIVATE_KEY,
//   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// });

// const doc = new GoogleSpreadsheet(
//   '<the sheet ID from the url>',
//   serviceAccountAuth,
// );

// const SHEET_ID = '1707-EQeZmD3Tp9xcqP2NQm40aH0wqs6bct0peALuRXo';
// // const CLIENT_EMAIL = 'fuel-tracker@fueltracker-421617.iam.gserviceaccount.com';
// // const PRIVATE_KEY = '0016f574f582cb461698cfd9924a20b711fb44e0';

// // const doc = new GoogleSpreadsheet(SHEET_ID);

// const accessSpreadsheet = async () => {
//   try {
//     await doc.loadInfo(); // loads document properties and worksheets
//     console.log(doc.title);
//     // await doc.updateProperties({title: 'renamed doc'});

//     const sheet = doc.sheetsByIndex[SHEET_ID]; // or use `doc.sheetsById[id]` or `doc.sheetsByTitle[title]`
//     console.log(sheet.title);
//     console.log(sheet.rowCount);
//     // await doc.useServiceAccountAuth({
//     //   client_email: CLIENT_EMAIL,
//     //   private_key: PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace escaped newline characters
//     // });
//     // await doc.loadInfo(); // Loads document properties and worksheets
//     // const sheet = doc.sheetsByIndex[0]; // Get the first sheet

//     // console.log('data adding in sheet');
//     // Example: Append data to the sheet
//     await sheet.addRow({
//       Timestamp: new Date().toLocaleString(),
//       Data: 'Sample Data',
//     });

//     console.log('Data added to Google Sheets successfully');
//   } catch (error) {
//     console.error('Error accessing Google Sheets:', error);
//   }
// };

// export default accessSpreadsheet;

// // import { GoogleSpreadsheet } from 'google-spreadsheet';
// // import axios from 'axios';

// // const SHEET_ID = '1707-EQeZmD3Tp9xcqP2NQm40aH0wqs6bct0peALuRXo';
// // const CLIENT_EMAIL = 'fuel-tracker@fueltracker-421617.iam.gserviceaccount.com';
// // const PRIVATE_KEY = '0016f574f582cb461698cfd9924a20b711fb44e0';

// // const doc = new GoogleSpreadsheet(SHEET_ID);

// // const   accessSpreadsheet=async()=>{
// //   try {
// //     await doc.useServiceAccountAuth({
// //       client_email: CLIENT_EMAIL,
// //       private_key: PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace escaped newline characters
// //     });
// //     await doc.loadInfo(); // Loads document properties and worksheets
// //     const sheet = doc.sheetsByIndex[0]; // Get the first sheet

// //     console.log('data adding in sheet')
// //     // Example: Append data to the sheet
// //     await sheet.addRow({ Timestamp: new Date().toLocaleString(), Data: 'Sample Data' });

// //     console.log('Data added to Google Sheets successfully');
// //   } catch (error) {
// //     console.error('Error accessing Google Sheets:', error);
// //   }
// // }

// // export default accessSpreadsheet;
