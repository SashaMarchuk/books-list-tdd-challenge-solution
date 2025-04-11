# Reaktivate TDD Challenge 1 - Refactored Book List App

This project is a refactored version of a simple React application designed to demonstrate a fast-test approach (MVP/MVVM) by separating application logic from the UI presentation layer. It uses MobX for state management.

## Overview

The application displays a list of books fetched from an API and allows users to add new books. It also features:

*   Separation of concerns using a Model-View-Presenter/Controller pattern.
*   State management with MobX.
*   Unit tests for the logic layer (controller and repository).
*   Functionality to switch between viewing "All Books" and "Private Books".
*   A header displaying the count of "Private Books".

## Prerequisites

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js) or [yarn](https://yarnpkg.com/)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/SashaMarchuk/Reaktivate-TDD---challenge-1-sample-begin-.git
    cd Reaktivate-TDD---challenge-1-sample-begin-
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

## Running the Application (Development Mode)

To start the application locally for development:

```bash
npm start
```

or

```bash
yarn start
```

This will launch the application in your default browser, typically at `http://localhost:3000`. The app will automatically reload if you make changes to the code.

**Important API Note:** The backend API (`https://tdd.demo.reaktivate.com`) uses a self-signed SSL certificate. Before the application can successfully fetch data, you need to manually trust this certificate in your browser. The easiest way is to navigate to the API base URL directly in your browser (e.g., [https://tdd.demo.reaktivate.com/v1/books/test-test-test](https://tdd.demo.reaktivate.com/v1/books/test-test-test)) and accept the security warning to proceed.

## Running Tests

To run the unit tests for the controller and repository logic:

```bash
npm test
```

or

```bash
yarn test
```

This command runs the tests in interactive watch mode. Press `a` to run all tests or follow the on-screen prompts.

## Building for Production

To create an optimized production build of the application:

```bash
npm run build
```

or

```bash
yarn build
```

This will create a `build` directory containing the static assets ready for deployment.

## Architecture

The application follows an MVP (Model-View-Presenter) / MVVM (Model-View-ViewModel) pattern:

*   **View (`src/Books/BooksView.tsx`, `src/Shared/Header/Header.tsx`):** React components responsible solely for rendering the UI based on the state provided by the controller. Uses `mobx-react`'s `observer` HOC to react to state changes.
*   **Controller/Store (`src/Books/Books.controller.ts`):** Manages the application state (using MobX observables), contains all the presentation logic (fetching data, handling user input, updating state), and interacts with the repository. A singleton instance (`booksStore`) is used.
*   **Repository (`src/Books/Books.repository.ts`):** Abstracts data fetching logic, interacting with the API Gateway. Responsible for retrieving and sending book data.
*   **API Gateway (`src/Shared/ApiGateway.ts`):** Handles the actual HTTP requests to the backend API.
*   **Types (`src/Books/types.ts`):** TypeScript interfaces for data structures like `Book`.
*   **Configuration (`src/Shared/config.ts`):** Contains configuration like the API base URL and User ID.

## Key Files

*   `src/index.tsx`: Application entry point.
*   `src/App.tsx` (implicitly via `src/index.tsx`): Root component rendering the layout.
*   `src/Books/`: Contains all files related to the Books feature (View, Controller, Repository, Types, Tests).
*   `src/Shared/`: Contains reusable components and utilities (ApiGateway, Config, Header).
*   `package.json`: Project configuration and dependencies. 