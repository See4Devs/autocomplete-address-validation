# 📍 React Address Autocomplete

A simple yet powerful React app built with **Vite** that provides accurate address search, autocomplete suggestions, and address autofill using **Google Maps API**.

![Address Suggestion](https://i.imgur.com/otOlINQ.png)

---

## 🚀 Quick Start

Follow these steps to quickly set up your project locally:

### **1. Clone and Setup**

```bash
git clone https://github.com/See4Devs/autocomplete-address-validation.git
cd autocomplete-address-validation
npm install
```

### **2. Configure Google Maps API**

Replace the placeholder `YOUR_GOOGLE_API_KEY` in your code with your actual Google Maps API key:

```jsx
// Replace in your component
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_API_KEY";
```

### **3. Running the Project**

Start the development server:

```bash
npm run dev
```

Your application will run locally at:
```
http://localhost:5173
```

---

## 🛠️ Technologies Used

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Material UI](https://mui.com/)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview)
---

## 🌟 Features

- **Autocomplete Address Search:** Type a few letters and get real-time address suggestions from Google Maps.
- **Address Details Autofill:** Automatically fill fields like street, city, state, ZIP code, and country when selecting an address.
- **Address Verification:** Confirm the correctness of addresses using GeoPostcodes CSV data.

---

## 📖 Code Overview

The main logic is encapsulated in `AddressSearchForm.jsx`:

- **Fetching Suggestions:** Utilizes the Google Places API to fetch suggestions based on user input.
- **Fetching Place Details:** Retrieves detailed address components when the user selects a suggestion.

---

## 📌 License

MIT License. Feel free to modify and distribute as needed.

---

**Author:** Lucien Chemaly

**Happy coding! 🚀**