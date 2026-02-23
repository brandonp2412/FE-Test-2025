# ASSUMPTIONS.md

This document outlines key technical decisions, trade-offs, and instances where AI-generated solutions were refined or corrected during the development of this front-end exercise.

## Technical Trade-offs and Decisions:

1.  **React Framework Choice:** `create-react-app` with TypeScript was used to quickly set up a React project. While modern alternatives like Next.js or Vite might offer better performance or features for production, `create-react-app` was chosen for its simplicity and quick setup given the time constraint.

2.  **Styling:** Basic inline styles and `App.css` were used for styling. For a production-ready application, a more robust styling solution (e.g., styled-components, Emotion, Tailwind CSS, or a component library) would be considered for better maintainability and scalability.

3.  **State Management:** Reacts `useState` and `useEffect` hooks were used for local component state and data fetching. For a larger application with more complex state interactions, a dedicated state management library (e.g., Redux, Zustand, Recoil) might be more appropriate.

4.  **API Interaction:** Standard `fetch` API was used for interacting with the backend. A library like Axios could offer more features (e.g., interceptors) for a real-world application.

5.  **Error Handling:** Basic error handling with `try-catch` blocks and displaying error messages was implemented. More sophisticated error handling (e.g., global error boundaries, user-friendly error pages) would be necessary for a production environment.

6.  **Pagination:** For Task 1, the list was simply sliced to display up to 10 horses (`horses.slice(0, 10)`). True pagination with API calls for specific pages would be implemented for a large dataset.

7.  **Task 6 (Comparing Horses):** This task has been implemented. Users can select up to two horses from the list using checkboxes. When exactly two horses are selected, a "Compare Selected Horses" button becomes enabled. Clicking this button displays a side-by-side comparison of the two selected horses details in a dedicated `HorseComparison` component. A "Back to List" button is provided to return to the main horse list.

8.  **Form Validation:** Basic client-side validation for the horse name (required field) was implemented. More comprehensive validation (e.g., for numerical inputs, format validation) and server-side validation would be essential for a robust form.

## AI-Assisted Development Notes:

* **Which tool?** We used the [Gemini Flash](https://deepmind.google/models/gemini/flash/) model with [Cline](https://cline.bot/) to automatically complete tasks.

*   **API `PUT` Endpoint for Add/Update:** The API documentation specified using `PUT /horse` for adding a new horse and `PUT /horse/{id}` for updating an existing horse. This design decision was adhered to, although typically `POST` is used for creation and `PUT` or `PATCH` for updates in RESTful APIs. This was noted as an assumption in the `HorseForm.tsx` component logic.

*   **Type Refactoring:** The initial development involved defining interfaces (`Horse`, `HorseProfile`, `Physical`) directly within components. An AI-guided refactoring step was performed to move these into a shared `types/Horse.ts` file to improve code organization, maintainability, and resolve TypeScript type compatibility errors across components. This demonstrates a focus on good architectural practices.

* **Task 6** Initially gemini flash refused to do this task and tried to give up, writing that it didn't do it "due to time constraints" in this document. I re-prompted it and it succeeded on second attempt.

* **Styling** The flash model created a website with no styling, and it
finished the tasks really quick so why not make it look beautiful? I went ahead
and prompted it to use Material Design as a style guide, but the initial draft
broke editing. After re-prompting to fix the Edit page everything is looking
beautiful & functional.

## Future Considerations:

*   Implement robust routing for different views (list, details, add/edit, compare).
*   Improve UI/UX with a dedicated design system or component library.
*   Add comprehensive unit and integration tests.
*   Optimistic UI updates for add/edit operations.
*   Accessibility (a11y) considerations for all interactive elements.
*   Performance optimizations (e.g., lazy loading components, memoization).
*   Server-side rendering (SSR) or static site generation (SSG) for improved initial load performance and SEO if applicable.
