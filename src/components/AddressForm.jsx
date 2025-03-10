import Papa from "papaparse";
import React, { useState } from "react";
import {
  TextField,
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Paper,
  Button,
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Star,
  Home,
  Public,
  Place,
  Apartment,
  Map,
  Flag,
} from "@mui/icons-material";

// **Replace with your actual Google API Key**
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_API_KEY";

const verifyAddress = async (zip, city) => {
  const response = await fetch("/GPC-STRT-GEO-SAMPLE-US.csv");
  const csvData = await response.text();
  const parsedData = Papa.parse(csvData, { header: true }).data;
  return parsedData.some(
    (entry) =>
      entry.postcode === zip &&
      entry.locality.toLowerCase() === city.toLowerCase()
  );
};

const AddressSearchForm = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsOpen, setSuggestionsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    rating: "",
    street: "",
    city: "",
    district: "",
    state: "",
    zip: "",
    country: "",
  });

  // **Fetch autocomplete suggestions using Google Places API (POST)**
  const fetchSuggestions = async (input) => {
    setLoading(true);
    setSuggestions([]);
    try {
      const response = await fetch(
        "https://places.googleapis.com/v1/places:searchText",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
            "X-Goog-FieldMask":
              "places.id,places.displayName,places.formattedAddress",
          },
          body: JSON.stringify({ textQuery: input, languageCode: "en" }),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (data.places) {
        setSuggestionsOpen(true);
        setSuggestions(data.places);
      } else {
        setSuggestions([]);
        setSuggestionsOpen(false);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setLoading(false);
      setSuggestionsOpen(false);
      setSuggestions([]);
    }
  };

  // **Fetch place details from Google API (GET)**
  const fetchPlaceDetails = async (placeId, placeName) => {
    if (!placeId) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}?fields=id,displayName,formattedAddress,internationalPhoneNumber,rating,location,adrFormatAddress,addressComponents&key=${GOOGLE_MAPS_API_KEY}`
      );

      const data = await response.json();
      setLoading(false);

      if (data && data.displayName) {
        const getComponent = (type) =>
          data.addressComponents?.find((c) => c.types.includes(type))
            ?.longText || "";

        setAddress({
          name: data.displayName?.text || "N/A",
          phone: data.internationalPhoneNumber || "N/A",
          rating: data.rating || "N/A",
          street: getComponent("street_number") + " " + getComponent("route"),
          city: getComponent("locality"),
          district: getComponent("sublocality"),
          state: getComponent("administrative_area_level_1"),
          zip: getComponent("postal_code"),
          country: getComponent("country"),
        });

        setQuery(placeName);
        setSuggestionsOpen(false);
        setSuggestions([]); // Hide suggestions
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
      setLoading(false);
    }
  };

  const onQueryChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value.length > 2) {
      const delayDebounce = setTimeout(() => {
        fetchSuggestions(query);
      }, 500); // Debounce API calls (wait 500ms)
      return () => clearTimeout(delayDebounce);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "40px auto",
        padding: 3,
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{ color: "#333", textAlign: "center" }}
      >
        Address Autocomplete
      </Typography>

      {/* Search Input */}
      <TextField
        label="Search Address"
        variant="outlined"
        fullWidth
        value={query}
        onChange={onQueryChange}
        sx={{
          mb: 2,
          backgroundColor: "#fff",
          borderRadius: 1,
        }}
      />

      {/* Loading Indicator */}
      {loading && (
        <CircularProgress
          size={24}
          sx={{ display: "block", margin: "10px auto", color: "#1976d2" }}
        />
      )}

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && isSuggestionsOpen && (
        <Paper
          sx={{
            position: "absolute",
            zIndex: 10,
            width: "100%",
            maxWidth: 600,
            borderRadius: 1,
            overflow: "hidden",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
          }}
        >
          <List>
            {suggestions.map((suggestion) => (
              <ListItem
                button
                key={suggestion.id}
                onClick={() =>
                  fetchPlaceDetails(suggestion.id, suggestion.displayName?.text)
                }
                sx={{
                  cursor: "pointer",
                  transition: "background 0.3s",
                  "&:hover": { backgroundColor: "#e3f2fd" },
                }}
              >
                <LocationOn sx={{ marginRight: 1, color: "#1976d2" }} />
                <ListItemText
                  primary={suggestion.displayName?.text}
                  secondary={suggestion.formattedAddress}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Auto-Filled Address Fields */}
      <Grid container spacing={2} sx={{ mt: 3 }}>
        {[
          { label: "Business Name", value: address.name, icon: <Place /> },
          { label: "Street", value: address.street, icon: <Home /> },
          { label: "City", value: address.city, icon: <LocationOn /> },
          { label: "District", value: address.district, icon: <Apartment /> },
          { label: "State", value: address.state, icon: <Map /> },
          { label: "ZIP Code", value: address.zip, icon: <Public /> },
          { label: "Country", value: address.country, icon: <Flag /> },
          { label: "Phone Number", value: address.phone, icon: <Phone /> },
          {
            label: "Rating",
            value: address.rating,
            icon: <Star sx={{ color: "#FFD700" }} />,
          },
        ].map((field, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <TextField
              label={field.label}
              variant="outlined"
              fullWidth
              value={field.value}
              disabled
              sx={{ backgroundColor: "#fff", borderRadius: 1 }}
              InputProps={{ startAdornment: field.icon }}
            />
          </Grid>
        ))}
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={async () => {
              const isValid = await verifyAddress(address.zip, address.city);
              alert(
                isValid
                  ? "Address verified successfully!"
                  : "Address verification failed."
              );
            }}
          >
            Verify Address
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AddressSearchForm;