# My-Nakama

Welcome to My-Nakama, a conversational AI therapist application built using LangChainJs, Google Generative AI, Supabase and React. This application allows users to have a supportive and empathetic conversation with an AI therapist.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

My-Nakama is designed to simulate a conversation with a friendly and empathetic therapist. The AI provides supportive responses and asks follow-up questions to create a conversational experience. The application uses LangChain and Google Generative AI to generate contextually relevant responses based on the user's input and chat history.

## Features

- Interactive chat interface
- Context-aware responses
- Conversational AI therapist
- Easy-to-use interface

## Installation

To run this project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/shalwin04/my-nakama.git
   cd my-nakama
   ```

2. Install server dependencies:
   ```bash
   cd back-end
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd ../front-end
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the `back-end` directory.
   - Add your Google API key:
     ```
     GOOGLE_API_KEY=your_google_api_key
     ```

## Usage

### Running the Server

1. Start the server:
   ```bash
   cd back-end
   node Main.js
   ```

### Running the Client

1. Start the client:
   ```bash
   cd front-end
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`.

## Technologies

- **Front-end**: React, TaiwindCss, DaisyUI
- **Back-end**: Node.js, Express, Supabase, LangChain Js
- **AI**: Google Generative AI (Gemini)

## Project Structure

```
my-nakama/
├── back-end/
│   ├── Home.js
│   ├── package.json
│   ├── .env
├── front-end/
│   ├── src/
│   │   ├── App.js
│   │   ├── Home.js
│   ├── public/
│   ├── package.json
├── README.md
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Make your changes and commit them: `git commit -m 'Add feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or feedback, please contact shalwin04.

- GitHub: [shalwin04](https://github.com/shalwin04)
  
