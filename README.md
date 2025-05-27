🛠️ How to Run This Project Locally
If you want to run the EduPath website on your own machine after cloning from GitHub, follow these steps carefully:

✅ Prerequisites
Make sure you have the following installed:

Node.js (v16 or above)
👉 Download from: https://nodejs.org/

npm (comes with Node.js)

Git
👉 Download from: https://git-scm.com/

📦 Step-by-Step Instructions
1️⃣ Clone the Repository

git clone https://github.com/your-username/edupath.git

2️⃣ Navigate to the Project Folder
cd edupath

3️⃣ Install All Dependencies
npm install
This command installs all the packages listed in package.json.

4️⃣ Set Up Environment Variables

Please ask the project owner for the correct .env values.

5️⃣ Run the Development Server

npm run dev

http://localhost:5173
Open it in your browser to view the website.

🐞 Troubleshooting
If you get an error like vite not found, try installing it globally:

npm install -g vite
If ports are already in use, change the port in vite.config.js or .env.

🙋‍♂️ Need Help?
If you face any issues during setup, feel free to open an issue in the GitHub repo or contact the project owner.


🔗 Useful Commands
Command	Description
npm install	(Install all dependencies)
npm run dev	(Start development server)
npm run build	(Build project for production)
npm run preview	(Preview production build)

🧑‍💻 Author
Developed by Abusaleh Alam Khan
Feel free to contribute or fork this project!

