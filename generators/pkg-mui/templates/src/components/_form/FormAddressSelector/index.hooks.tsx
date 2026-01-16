import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  setOptions as setGoogleMapsOptions,
  importLibrary,
} from "@googlemaps/js-api-loader";

interface AddressData {
  formatted_address: string;
  place_id: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

export const useFormAddressSelector = (name: string) => {
  const { control, setValue, watch, trigger } = useFormContext();
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [inputValue, setInputValue] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);

  const currentValue = watch(name);

  // Sync inputValue with form value changes (including reset)
  useEffect(() => {
    if (currentValue) {
      setInputValue(currentValue.formatted_address || "");
    } else {
      setInputValue("");
    }
  }, [currentValue]);

  useEffect(() => {
    console.log("FormAddressSelector: Initializing Google Maps...");
    const initializeGoogleMaps = async () => {
      try {
        console.log("FormAddressSelector: Setting Google Maps options...");
        setGoogleMapsOptions({
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
          v: "weekly",
          libraries: ["places"],
        });

        console.log("FormAddressSelector: Importing libraries...");
        const { Map } = await importLibrary("maps");
        const { AutocompleteService, PlacesService } = await importLibrary(
          "places",
        );
        console.log("FormAddressSelector: Libraries imported successfully");

        // Create a hidden map div for PlacesService
        if (mapRef.current) {
          console.log("FormAddressSelector: Creating map instance...");
          const map = new Map(mapRef.current, {
            center: { lat: 0, lng: 0 },
            zoom: 1,
          });

          console.log("FormAddressSelector: Setting up services...");
          setAutocompleteService(new AutocompleteService());
          setPlacesService(new PlacesService(map));
          console.log("FormAddressSelector: Services initialized successfully");
        } else {
          console.warn("FormAddressSelector: mapRef.current is null");
        }
      } catch (error) {
        console.error("FormAddressSelector: Error loading Google Maps:", error);
      }
    };

    initializeGoogleMaps();
  }, []);

  const handleInputChange = async (
    event: React.SyntheticEvent,
    value: string,
  ) => {
    console.log(
      "FormAddressSelector: handleInputChange called with value:",
      value,
    );
    setInputValue(value);

    if (value.length < 3 || !autocompleteService) {
      console.log(
        "FormAddressSelector: Input too short or autocompleteService not ready",
        {
          valueLength: value.length,
          hasAutocompleteService: !!autocompleteService,
        },
      );
      setOptions([]);
      return;
    }

    console.log("FormAddressSelector: Starting autocomplete request...");
    setLoading(true);
    try {
      const request: google.maps.places.AutocompleteRequest = {
        input: value,
      };

      console.log("FormAddressSelector: Making autocomplete request:", request);
      autocompleteService.getPlacePredictions(
        request,
        (predictions, status) => {
          console.log("FormAddressSelector: Autocomplete response:", {
            predictions,
            status,
          });
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            console.log(
              "FormAddressSelector: Setting options:",
              predictions.length,
              "predictions",
            );
            setOptions(predictions);
          } else {
            console.log("FormAddressSelector: No predictions or error status");
            setOptions([]);
          }
          setLoading(false);
        },
      );
    } catch (error) {
      console.error("FormAddressSelector: Error fetching predictions:", error);
      setLoading(false);
    }
  };

  const handleSelectionChange = async (
    event: React.SyntheticEvent,
    value: google.maps.places.AutocompletePrediction | null,
  ) => {
    console.log(
      "FormAddressSelector: handleSelectionChange called with value:",
      value,
    );

    // Handle clearing the field (when value is null)
    if (!value) {
      console.log("FormAddressSelector: Clearing address field");
      setValue(name, undefined, { shouldValidate: true });
      setInputValue("");
      return;
    }

    // If placesService is not ready, we can't get place details
    if (!placesService) {
      console.log("FormAddressSelector: placesService not ready");
      return;
    }

    console.log(
      "FormAddressSelector: Getting place details for placeId:",
      value.place_id,
    );
    const request: google.maps.places.PlaceDetailsRequest = {
      placeId: value.place_id,
      fields: [
        "formatted_address",
        "place_id",
        "geometry",
        "address_components",
      ],
    };

    placesService.getDetails(request, (place, status) => {
      console.log("FormAddressSelector: Place details response:", {
        place,
        status,
      });
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        const addressData: AddressData = {
          formatted_address: place.formatted_address || "",
          place_id: place.place_id || "",
          geometry: {
            location: {
              lat: place.geometry?.location?.lat() || 0,
              lng: place.geometry?.location?.lng() || 0,
            },
          },
          address_components: place.address_components || [],
        };

        console.log(
          "FormAddressSelector: Setting form value with address data:",
          addressData,
        );
        setValue(name, addressData, {
          shouldValidate: true,
          shouldTouch: true,
        });
        setInputValue(place.formatted_address || "");
        // Explicitly trigger validation to clear any error state
        trigger(name);
      } else {
        console.log("FormAddressSelector: Failed to get place details");
      }
    });
  };

  console.log("FormAddressSelector: Hook state:", {
    hasAutocompleteService: !!autocompleteService,
    hasPlacesService: !!placesService,
    loading,
    optionsCount: options.length,
    inputValue,
    currentValue,
  });

  return {
    control,
    currentValue,
    mapRef,
    options,
    inputValue,
    loading,
    handleInputChange,
    handleSelectionChange,
  };
};
