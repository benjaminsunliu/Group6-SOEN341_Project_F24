# Group6-SOEN341_Project_F24

For sprint 1 and 2 documentation, see the [wiki](https://github.com/benjaminsunliu/Group6-SOEN341_Project_F24/wiki).
## Project Description
University team projects often struggle with unequal contributions and lack accountability. This peer assessment platform enables students to evaluate their teammates across four key dimensions, promoting accountability and offering valuable feedback for both students and instructors.

## Features
- **Comprehensive Four-Dimension Assessments**:
	- _Cooperation_: Evaluates a student’s ability to take initiative, communicate, assist peers, and contribute to meetings and project planning.
	- _Conceptual Contribution_: Assesses a student’s involvement in research, design, and contributing ideas.
	- _Practical Contribution_: Measures a student’s engagement and initiative in producing deliverables and providing constructive feedback.
	- _Work Ethic_: Examines a student’s attitude toward the project and peers and their ability to meet deadlines and project milestones.

- **Anonymous Peer Evaluations**: Encourages fair and honest feedback.
- **Peer Feedback Summaries for Instructors**: Helps instructors assess team dynamics and evaluate each student’s performance and contributions.
- **Personal Feedback Report for Students**: Offers students constructive feedback on their contributions, encouraging personal growth.

## Installation Instructions
### Prerequisites
- Node.js and npm: Install Node.js, which includes npm, the Node package manager. You can download it from the official Node.js website.
- MongoDB: Install MongoDB to manage the project's database. Download it from the official MongoDB website.
### Steps
- Clone the Repository:`git clone https://github.com/benjaminsunliu/Group6-SOEN341_Project_F24.git`
- Navigate to the Project Directory: `cd Group6-SOEN341_Project_F24`
- Backend Setup:
```
cd backend
npm install
node server
```
The backend server will run on http://localhost:5050.

- Frontend Setup:
```
cd ../client
npm install
npm start
```
The frontend will run on http://localhost:3000.

- For Unit testing 
```
cd ../client
npm install
npm install --save-dev jest //install Jest as a development dependency
npm test 
```

Accessing the Application:
Open your browser and navigate to http://localhost:3000 to use the application.

## Technology Stack
- **Node.js**
- **React**
- **Express**
- **MongoDB**

## User Roles
- **Students**: Can evaluate their teammates across the four assessment dimensions and access personal feedback reports.
- **Instructors**: Can create and manage teams from their course roster (with the option to import team lists as a CSV file). After students have submitted their peer evaluations, instructors may view and export individualised reports.

## Team Members
### Backend Development
- [Benjamin Liu](https://github.com/benjaminsunliu), BEng. Software Engineering (COOP) (2023-2027)
- [Jordan Yeh](https://github.com/YehJordan), BEng. Software Engineering (COOP) (2023-2027)

### Database Development
- [Mustafa Al Awadi](https://github.com/MustafaHunter), BCompSc. Bachelor of Computer Science (2022-2025)
- [Mehrad Mostaan](https://github.com/Mehrad25Software), BEng. Software Engineering (C.Edge) (2022-2026)
  
### Frontend Development
- [Anthony Phelps](https://github.com/oldgrandma101), BEng. Computer Engineering (C. Edge) (2022-2026)
- [Ella Noyes](https://github.com/en4395), BEng. Computer Engineering (C. Edge) (2022-2026)

### Running the Project

### Prerequisites

  - Make sure you have Node.js installed 
  - Have MongoDB installed to see changes in the database
  - Have the CSV files ready for testing, ensure the format is fname	lname	email	studentID	phone

    
### Install Dependencies
   - Run npm install command to install all required dependencies
   - For file uploads, run npm install multer
     
### Run the Application
   - Start the application with npm start and access it at http://localhost:3000.



### Conclusion

This peer assessment platform aims to foster a collaborative and accountable environment for students working on team projects, ultimately leading to a more equitable and productive learning experience.
