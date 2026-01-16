import { useCallback, useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";

interface Country {
  code: string;
  name: string;
  dialCode: string;
  format: string;
}

const countries: Country[] = [
  { code: "AD", name: "Andorra", dialCode: "+376", format: "### ###" },
  {
    code: "AE",
    name: "United Arab Emirates",
    dialCode: "+971",
    format: "### ### ####",
  },
  { code: "AF", name: "Afghanistan", dialCode: "+93", format: "### ### ###" },
  {
    code: "AG",
    name: "Antigua and Barbuda",
    dialCode: "+1",
    format: "(###) ###-####",
  },
  { code: "AI", name: "Anguilla", dialCode: "+1", format: "(###) ###-####" },
  { code: "AL", name: "Albania", dialCode: "+355", format: "### ### ###" },
  { code: "AM", name: "Armenia", dialCode: "+374", format: "### ### ###" },
  { code: "AO", name: "Angola", dialCode: "+244", format: "### ### ###" },
  { code: "AR", name: "Argentina", dialCode: "+54", format: "### ###-#####" },
  {
    code: "AS",
    name: "American Samoa",
    dialCode: "+1",
    format: "(###) ###-####",
  },
  { code: "AT", name: "Austria", dialCode: "+43", format: "### ########" },
  { code: "AU", name: "Australia", dialCode: "+61", format: "### ### ###" },
  { code: "AW", name: "Aruba", dialCode: "+297", format: "### ####" },
  { code: "AZ", name: "Azerbaijan", dialCode: "+994", format: "### ### ####" },
  {
    code: "BA",
    name: "Bosnia and Herzegovina",
    dialCode: "+387",
    format: "### ### ###",
  },
  { code: "BB", name: "Barbados", dialCode: "+1", format: "(###) ###-####" },
  { code: "BD", name: "Bangladesh", dialCode: "+880", format: "### ### ####" },
  { code: "BE", name: "Belgium", dialCode: "+32", format: "### ## ## ##" },
  { code: "BF", name: "Burkina Faso", dialCode: "+226", format: "### ### ###" },
  { code: "BG", name: "Bulgaria", dialCode: "+359", format: "### ### ###" },
  { code: "BH", name: "Bahrain", dialCode: "+973", format: "#### ####" },
  { code: "BI", name: "Burundi", dialCode: "+257", format: "### ### ###" },
  { code: "BJ", name: "Benin", dialCode: "+229", format: "### ### ###" },
  {
    code: "BL",
    name: "Saint Barthélemy",
    dialCode: "+590",
    format: "### ## ## ##",
  },
  { code: "BM", name: "Bermuda", dialCode: "+1", format: "(###) ###-####" },
  { code: "BN", name: "Brunei", dialCode: "+673", format: "### ####" },
  { code: "BO", name: "Bolivia", dialCode: "+591", format: "### ### ###" },
  {
    code: "BQ",
    name: "Caribbean Netherlands",
    dialCode: "+599",
    format: "### ####",
  },
  { code: "BR", name: "Brazil", dialCode: "+55", format: "(##) #####-####" },
  { code: "BS", name: "Bahamas", dialCode: "+1", format: "(###) ###-####" },
  { code: "BT", name: "Bhutan", dialCode: "+975", format: "## ### ###" },
  { code: "BW", name: "Botswana", dialCode: "+267", format: "### ### ###" },
  { code: "BY", name: "Belarus", dialCode: "+375", format: "## ### ## ##" },
  { code: "BZ", name: "Belize", dialCode: "+501", format: "### ####" },
  { code: "CA", name: "Canada", dialCode: "+1", format: "(###) ###-####" },
  { code: "CC", name: "Cocos Islands", dialCode: "+61", format: "### ### ###" },
  {
    code: "CD",
    name: "Democratic Republic of the Congo",
    dialCode: "+243",
    format: "### ### ###",
  },
  {
    code: "CF",
    name: "Central African Republic",
    dialCode: "+236",
    format: "### ### ###",
  },
  {
    code: "CG",
    name: "Republic of the Congo",
    dialCode: "+242",
    format: "### ### ###",
  },
  { code: "CH", name: "Switzerland", dialCode: "+41", format: "## ### ## ##" },
  { code: "CI", name: "Ivory Coast", dialCode: "+225", format: "### ### ###" },
  { code: "CK", name: "Cook Islands", dialCode: "+682", format: "## ###" },
  { code: "CL", name: "Chile", dialCode: "+56", format: "### ### ###" },
  { code: "CM", name: "Cameroon", dialCode: "+237", format: "### ### ###" },
  { code: "CN", name: "China", dialCode: "+86", format: "### #### ####" },
  { code: "CO", name: "Colombia", dialCode: "+57", format: "### ### ####" },
  { code: "CR", name: "Costa Rica", dialCode: "+506", format: "#### ####" },
  { code: "CU", name: "Cuba", dialCode: "+53", format: "### ### ####" },
  { code: "CV", name: "Cape Verde", dialCode: "+238", format: "### ## ##" },
  { code: "CW", name: "Curaçao", dialCode: "+599", format: "### ####" },
  { code: "CY", name: "Cyprus", dialCode: "+357", format: "## ### ###" },
  {
    code: "CZ",
    name: "Czech Republic",
    dialCode: "+420",
    format: "### ### ###",
  },
  { code: "DE", name: "Germany", dialCode: "+49", format: "### ########" },
  { code: "DJ", name: "Djibouti", dialCode: "+253", format: "### ### ###" },
  { code: "DK", name: "Denmark", dialCode: "+45", format: "## ## ## ##" },
  { code: "DM", name: "Dominica", dialCode: "+1", format: "(###) ###-####" },
  {
    code: "DO",
    name: "Dominican Republic",
    dialCode: "+1",
    format: "(###) ###-####",
  },
  { code: "DZ", name: "Algeria", dialCode: "+213", format: "### ### ###" },
  { code: "EC", name: "Ecuador", dialCode: "+593", format: "### ### ###" },
  { code: "EE", name: "Estonia", dialCode: "+372", format: "### ### ###" },
  { code: "EG", name: "Egypt", dialCode: "+20", format: "### ### ####" },
  {
    code: "EH",
    name: "Western Sahara",
    dialCode: "+212",
    format: "### ### ###",
  },
  { code: "ER", name: "Eritrea", dialCode: "+291", format: "### ### ###" },
  { code: "ES", name: "Spain", dialCode: "+34", format: "### ## ## ##" },
  { code: "ET", name: "Ethiopia", dialCode: "+251", format: "### ### ###" },
  { code: "FI", name: "Finland", dialCode: "+358", format: "### ### ###" },
  { code: "FJ", name: "Fiji", dialCode: "+679", format: "### ####" },
  { code: "FK", name: "Falkland Islands", dialCode: "+500", format: "#####" },
  { code: "FM", name: "Micronesia", dialCode: "+691", format: "### ####" },
  { code: "FO", name: "Faroe Islands", dialCode: "+298", format: "### ###" },
  { code: "FR", name: "France", dialCode: "+33", format: "### ## ## ## ##" },
  { code: "GA", name: "Gabon", dialCode: "+241", format: "### ### ###" },
  {
    code: "GB",
    name: "United Kingdom",
    dialCode: "+44",
    format: "#### ### ####",
  },
  { code: "GD", name: "Grenada", dialCode: "+1", format: "(###) ###-####" },
  { code: "GE", name: "Georgia", dialCode: "+995", format: "### ### ###" },
  {
    code: "GF",
    name: "French Guiana",
    dialCode: "+594",
    format: "### ## ## ##",
  },
  { code: "GG", name: "Guernsey", dialCode: "+44", format: "#### ### ####" },
  { code: "GH", name: "Ghana", dialCode: "+233", format: "### ### ###" },
  { code: "GI", name: "Gibraltar", dialCode: "+350", format: "### #####" },
  { code: "GL", name: "Greenland", dialCode: "+299", format: "## ## ##" },
  { code: "GM", name: "Gambia", dialCode: "+220", format: "### ### ###" },
  { code: "GN", name: "Guinea", dialCode: "+224", format: "### ### ###" },
  { code: "GP", name: "Guadeloupe", dialCode: "+590", format: "### ## ## ##" },
  {
    code: "GQ",
    name: "Equatorial Guinea",
    dialCode: "+240",
    format: "### ### ###",
  },
  { code: "GR", name: "Greece", dialCode: "+30", format: "### ### ####" },
  { code: "GT", name: "Guatemala", dialCode: "+502", format: "#### ####" },
  { code: "GU", name: "Guam", dialCode: "+1", format: "(###) ###-####" },
  {
    code: "GW",
    name: "Guinea-Bissau",
    dialCode: "+245",
    format: "### ### ###",
  },
  { code: "GY", name: "Guyana", dialCode: "+592", format: "### ####" },
  { code: "HK", name: "Hong Kong", dialCode: "+852", format: "#### ####" },
  { code: "HN", name: "Honduras", dialCode: "+504", format: "####-####" },
  { code: "HR", name: "Croatia", dialCode: "+385", format: "### ### ###" },
  { code: "HT", name: "Haiti", dialCode: "+509", format: "#### ####" },
  { code: "HU", name: "Hungary", dialCode: "+36", format: "### ### ###" },
  { code: "ID", name: "Indonesia", dialCode: "+62", format: "###-###-####" },
  { code: "IE", name: "Ireland", dialCode: "+353", format: "### ### ###" },
  { code: "IL", name: "Israel", dialCode: "+972", format: "###-###-####" },
  { code: "IM", name: "Isle of Man", dialCode: "+44", format: "#### ### ####" },
  { code: "IN", name: "India", dialCode: "+91", format: "##### #####" },
  {
    code: "IO",
    name: "British Indian Ocean Territory",
    dialCode: "+246",
    format: "### ####",
  },
  { code: "IQ", name: "Iraq", dialCode: "+964", format: "### ### ####" },
  { code: "IR", name: "Iran", dialCode: "+98", format: "### ### ####" },
  { code: "IS", name: "Iceland", dialCode: "+354", format: "### ####" },
  { code: "IT", name: "Italy", dialCode: "+39", format: "### ### ####" },
  { code: "JE", name: "Jersey", dialCode: "+44", format: "#### ### ####" },
  { code: "JM", name: "Jamaica", dialCode: "+1", format: "(###) ###-####" },
  { code: "JO", name: "Jordan", dialCode: "+962", format: "### ### ####" },
  { code: "JP", name: "Japan", dialCode: "+81", format: "###-####-####" },
  { code: "KE", name: "Kenya", dialCode: "+254", format: "### ### ###" },
  { code: "KG", name: "Kyrgyzstan", dialCode: "+996", format: "### ### ###" },
  { code: "KH", name: "Cambodia", dialCode: "+855", format: "### ### ###" },
  { code: "KI", name: "Kiribati", dialCode: "+686", format: "### ####" },
  { code: "KM", name: "Comoros", dialCode: "+269", format: "### ### ###" },
  {
    code: "KN",
    name: "Saint Kitts and Nevis",
    dialCode: "+1",
    format: "(###) ###-####",
  },
  { code: "KP", name: "North Korea", dialCode: "+850", format: "### ### ####" },
  { code: "KR", name: "South Korea", dialCode: "+82", format: "###-####-####" },
  { code: "KW", name: "Kuwait", dialCode: "+965", format: "### ### ####" },
  {
    code: "KY",
    name: "Cayman Islands",
    dialCode: "+1",
    format: "(###) ###-####",
  },
  { code: "KZ", name: "Kazakhstan", dialCode: "+7", format: "### ### ####" },
  { code: "LA", name: "Laos", dialCode: "+856", format: "### ### ###" },
  { code: "LB", name: "Lebanon", dialCode: "+961", format: "### ### ###" },
  { code: "LC", name: "Saint Lucia", dialCode: "+1", format: "(###) ###-####" },
  {
    code: "LI",
    name: "Liechtenstein",
    dialCode: "+423",
    format: "### ### ###",
  },
  { code: "LK", name: "Sri Lanka", dialCode: "+94", format: "### ### ####" },
  { code: "LR", name: "Liberia", dialCode: "+231", format: "### ### ###" },
  { code: "LS", name: "Lesotho", dialCode: "+266", format: "### ### ###" },
  { code: "LT", name: "Lithuania", dialCode: "+370", format: "### ### ###" },
  { code: "LU", name: "Luxembourg", dialCode: "+352", format: "### ### ###" },
  { code: "LV", name: "Latvia", dialCode: "+371", format: "### ### ###" },
  { code: "LY", name: "Libya", dialCode: "+218", format: "### ### ###" },
  { code: "MA", name: "Morocco", dialCode: "+212", format: "### ### ###" },
  { code: "MC", name: "Monaco", dialCode: "+377", format: "## ## ## ##" },
  { code: "MD", name: "Moldova", dialCode: "+373", format: "### ### ###" },
  { code: "ME", name: "Montenegro", dialCode: "+382", format: "### ### ###" },
  {
    code: "MF",
    name: "Saint Martin",
    dialCode: "+590",
    format: "### ## ## ##",
  },
  { code: "MG", name: "Madagascar", dialCode: "+261", format: "### ### ###" },
  {
    code: "MH",
    name: "Marshall Islands",
    dialCode: "+692",
    format: "### ####",
  },
  {
    code: "MK",
    name: "North Macedonia",
    dialCode: "+389",
    format: "### ### ###",
  },
  { code: "ML", name: "Mali", dialCode: "+223", format: "### ### ###" },
  { code: "MM", name: "Myanmar", dialCode: "+95", format: "### ### ###" },
  { code: "MN", name: "Mongolia", dialCode: "+976", format: "### ### ###" },
  { code: "MO", name: "Macau", dialCode: "+853", format: "#### ####" },
  {
    code: "MP",
    name: "Northern Mariana Islands",
    dialCode: "+1",
    format: "(###) ###-####",
  },
  { code: "MQ", name: "Martinique", dialCode: "+596", format: "### ## ## ##" },
  { code: "MR", name: "Mauritania", dialCode: "+222", format: "### ## ## ##" },
  { code: "MS", name: "Montserrat", dialCode: "+1", format: "(###) ###-####" },
  { code: "MT", name: "Malta", dialCode: "+356", format: "#### ####" },
  { code: "MU", name: "Mauritius", dialCode: "+230", format: "### ### ###" },
  { code: "MV", name: "Maldives", dialCode: "+960", format: "### ####" },
  { code: "MW", name: "Malawi", dialCode: "+265", format: "### ### ###" },
  { code: "MX", name: "Mexico", dialCode: "+52", format: "### ### ####" },
  { code: "MY", name: "Malaysia", dialCode: "+60", format: "### ### ####" },
  { code: "MZ", name: "Mozambique", dialCode: "+258", format: "### ### ###" },
  { code: "NA", name: "Namibia", dialCode: "+264", format: "### ### ###" },
  { code: "NC", name: "New Caledonia", dialCode: "+687", format: "### ###" },
  { code: "NE", name: "Niger", dialCode: "+227", format: "### ### ###" },
  { code: "NF", name: "Norfolk Island", dialCode: "+672", format: "### ####" },
  { code: "NG", name: "Nigeria", dialCode: "+234", format: "### ### ####" },
  { code: "NI", name: "Nicaragua", dialCode: "+505", format: "#### ####" },
  { code: "NL", name: "Netherlands", dialCode: "+31", format: "## ### ####" },
  { code: "NO", name: "Norway", dialCode: "+47", format: "### ## ###" },
  { code: "NP", name: "Nepal", dialCode: "+977", format: "### ### ####" },
  { code: "NR", name: "Nauru", dialCode: "+674", format: "### ####" },
  { code: "NU", name: "Niue", dialCode: "+683", format: "### ####" },
  { code: "NZ", name: "New Zealand", dialCode: "+64", format: "### ### ###" },
  { code: "OM", name: "Oman", dialCode: "+968", format: "### ### ###" },
  { code: "PA", name: "Panama", dialCode: "+507", format: "####-####" },
  { code: "PE", name: "Peru", dialCode: "+51", format: "### ### ###" },
  {
    code: "PF",
    name: "French Polynesia",
    dialCode: "+689",
    format: "## ## ##",
  },
  {
    code: "PG",
    name: "Papua New Guinea",
    dialCode: "+675",
    format: "### ####",
  },
  { code: "PH", name: "Philippines", dialCode: "+63", format: "### ### ####" },
  { code: "PK", name: "Pakistan", dialCode: "+92", format: "### ### ####" },
  { code: "PL", name: "Poland", dialCode: "+48", format: "### ### ###" },
  {
    code: "PM",
    name: "Saint Pierre and Miquelon",
    dialCode: "+508",
    format: "### ## ##",
  },
  { code: "PR", name: "Puerto Rico", dialCode: "+1", format: "(###) ###-####" },
  { code: "PS", name: "Palestine", dialCode: "+970", format: "### ### ####" },
  { code: "PT", name: "Portugal", dialCode: "+351", format: "### ### ###" },
  { code: "PW", name: "Palau", dialCode: "+680", format: "### ####" },
  { code: "PY", name: "Paraguay", dialCode: "+595", format: "### ### ###" },
  { code: "QA", name: "Qatar", dialCode: "+974", format: "### ### ###" },
  { code: "RE", name: "Réunion", dialCode: "+262", format: "### ### ###" },
  { code: "RO", name: "Romania", dialCode: "+40", format: "### ### ###" },
  { code: "RS", name: "Serbia", dialCode: "+381", format: "### ### ###" },
  { code: "RU", name: "Russia", dialCode: "+7", format: "### ### ####" },
  { code: "RW", name: "Rwanda", dialCode: "+250", format: "### ### ###" },
  {
    code: "SA",
    name: "Saudi Arabia",
    dialCode: "+966",
    format: "### ### ####",
  },
  { code: "SB", name: "Solomon Islands", dialCode: "+677", format: "### ####" },
  { code: "SC", name: "Seychelles", dialCode: "+248", format: "### ### ###" },
  { code: "SD", name: "Sudan", dialCode: "+249", format: "### ### ###" },
  { code: "SE", name: "Sweden", dialCode: "+46", format: "### ### ###" },
  { code: "SG", name: "Singapore", dialCode: "+65", format: "#### ####" },
  { code: "SH", name: "Saint Helena", dialCode: "+290", format: "### ####" },
  { code: "SI", name: "Slovenia", dialCode: "+386", format: "### ### ###" },
  {
    code: "SJ",
    name: "Svalbard and Jan Mayen",
    dialCode: "+47",
    format: "### ## ###",
  },
  { code: "SK", name: "Slovakia", dialCode: "+421", format: "### ### ###" },
  { code: "SL", name: "Sierra Leone", dialCode: "+232", format: "### ### ###" },
  { code: "SM", name: "San Marino", dialCode: "+378", format: "### ###" },
  { code: "SN", name: "Senegal", dialCode: "+221", format: "### ### ###" },
  { code: "SO", name: "Somalia", dialCode: "+252", format: "### ### ###" },
  { code: "SR", name: "Suriname", dialCode: "+597", format: "###-####" },
  { code: "SS", name: "South Sudan", dialCode: "+211", format: "### ### ###" },
  {
    code: "ST",
    name: "São Tomé and Príncipe",
    dialCode: "+239",
    format: "### ### ###",
  },
  { code: "SV", name: "El Salvador", dialCode: "+503", format: "#### ####" },
  {
    code: "SX",
    name: "Sint Maarten",
    dialCode: "+1",
    format: "(###) ###-####",
  },
  { code: "SY", name: "Syria", dialCode: "+963", format: "### ### ####" },
  { code: "SZ", name: "Eswatini", dialCode: "+268", format: "### ### ###" },
  {
    code: "TC",
    name: "Turks and Caicos Islands",
    dialCode: "+1",
    format: "(###) ###-####",
  },
  { code: "TD", name: "Chad", dialCode: "+235", format: "### ### ###" },
  { code: "TG", name: "Togo", dialCode: "+228", format: "### ### ###" },
  { code: "TH", name: "Thailand", dialCode: "+66", format: "### ### ###" },
  { code: "TJ", name: "Tajikistan", dialCode: "+992", format: "### ### ###" },
  { code: "TK", name: "Tokelau", dialCode: "+690", format: "### ####" },
  { code: "TL", name: "East Timor", dialCode: "+670", format: "### ####" },
  { code: "TM", name: "Turkmenistan", dialCode: "+993", format: "### ### ###" },
  { code: "TN", name: "Tunisia", dialCode: "+216", format: "## ### ###" },
  { code: "TO", name: "Tonga", dialCode: "+676", format: "### ####" },
  { code: "TR", name: "Turkey", dialCode: "+90", format: "### ### ####" },
  {
    code: "TT",
    name: "Trinidad and Tobago",
    dialCode: "+1",
    format: "(###) ###-####",
  },
  { code: "TV", name: "Tuvalu", dialCode: "+688", format: "### ####" },
  { code: "TW", name: "Taiwan", dialCode: "+886", format: "### ### ###" },
  { code: "TZ", name: "Tanzania", dialCode: "+255", format: "### ### ###" },
  { code: "UA", name: "Ukraine", dialCode: "+380", format: "### ### ####" },
  { code: "UG", name: "Uganda", dialCode: "+256", format: "### ### ###" },
  {
    code: "US",
    name: "United States",
    dialCode: "+1",
    format: "(###) ###-####",
  },
  { code: "UY", name: "Uruguay", dialCode: "+598", format: "### ### ###" },
  { code: "UZ", name: "Uzbekistan", dialCode: "+998", format: "### ### ####" },
  { code: "VA", name: "Vatican City", dialCode: "+379", format: "### ###" },
  {
    code: "VC",
    name: "Saint Vincent and the Grenadines",
    dialCode: "+1",
    format: "(###) ###-####",
  },
  { code: "VE", name: "Venezuela", dialCode: "+58", format: "###-###-####" },
  {
    code: "VG",
    name: "British Virgin Islands",
    dialCode: "+1",
    format: "(###) ###-####",
  },
  {
    code: "VI",
    name: "U.S. Virgin Islands",
    dialCode: "+1",
    format: "(###) ###-####",
  },
  { code: "VN", name: "Vietnam", dialCode: "+84", format: "### ### ####" },
  { code: "VU", name: "Vanuatu", dialCode: "+678", format: "### ####" },
  {
    code: "WF",
    name: "Wallis and Futuna",
    dialCode: "+681",
    format: "### ###",
  },
  { code: "WS", name: "Samoa", dialCode: "+685", format: "### ####" },
  { code: "YE", name: "Yemen", dialCode: "+967", format: "### ### ####" },
  { code: "YT", name: "Mayotte", dialCode: "+262", format: "### ### ###" },
  { code: "ZA", name: "South Africa", dialCode: "+27", format: "### ### ####" },
  { code: "ZM", name: "Zambia", dialCode: "+260", format: "### ### ###" },
  { code: "ZW", name: "Zimbabwe", dialCode: "+263", format: "### ### ###" },
];

export const useFormPhoneSelector = (
  name: string,
  defaultCountryCode?: string,
) => {
  const { setValue, watch } = useFormContext();
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find((c) => c.code === defaultCountryCode) ||
      countries.find((c) => c.code === "US") ||
      countries[0],
  );
  const [phoneNumber, setPhoneNumber] = useState("");

  const currentValue = watch(name);

  useEffect(() => {
    if (currentValue) {
      let phoneValue = currentValue.trim();

      // Try to parse the stored phone number to extract country and number
      // Handle different formats:
      // 1. "+39 3930287073" (with space)
      // 2. "+393930287073" (without space)
      // 3. "39 3930287073" (without +, with space)
      // 4. "393930287073" (without +, without space)

      // First try: split by space (format: "+39 3930287073" or "39 3930287073")
      const parts = phoneValue.split(" ");
      if (parts.length >= 2) {
        const dialCodeCandidate = parts[0];
        const country = countries.find((c) => c.dialCode === dialCodeCandidate);
        if (country) {
          setSelectedCountry(country);
          setPhoneNumber(parts.slice(1).join(" "));
          return;
        }
      }

      // Second try: find matching dial code at the start (format: "+393930287073")
      // Sort countries by dial code length (longest first) to match longest dial codes first
      const sortedCountries = [...countries].sort(
        (a, b) => b.dialCode.length - a.dialCode.length,
      );

      for (const country of sortedCountries) {
        const dialCode = country.dialCode;
        // Remove + from dial code for comparison
        const dialCodeWithoutPlus = dialCode.replace("+", "");

        // Check if the phone value starts with the dial code (with or without +)
        if (phoneValue.startsWith(dialCode)) {
          // Extract the phone number part (after dial code)
          // Remove the dial code and any leading/trailing spaces
          let phoneNumberPart = phoneValue.substring(dialCode.length).trim();
          // Remove any non-digit characters that might be leftover formatting
          phoneNumberPart = phoneNumberPart.replace(/\D/g, "");
          if (phoneNumberPart.length > 0) {
            setSelectedCountry(country);
            setPhoneNumber(phoneNumberPart);
            return;
          }
        } else if (phoneValue.startsWith(dialCodeWithoutPlus)) {
          // Extract the phone number part (after dial code without +)
          let phoneNumberPart = phoneValue
            .substring(dialCodeWithoutPlus.length)
            .trim();
          // Remove any non-digit characters that might be leftover formatting
          phoneNumberPart = phoneNumberPart.replace(/\D/g, "");
          if (phoneNumberPart.length > 0) {
            setSelectedCountry(country);
            setPhoneNumber(phoneNumberPart);
            return;
          }
        }
      }

      // If no match found, try to parse as just the dial code part
      // This handles cases where only the dial code is stored
      if (phoneValue.startsWith("+")) {
        const country = countries.find((c) => c.dialCode === phoneValue);
        if (country) {
          setSelectedCountry(country);
          setPhoneNumber("");
          return;
        }
      }
    } else {
      // Reset when value is empty
      setPhoneNumber("");
    }
  }, [currentValue]);

  const formatPhoneNumber = useCallback(
    (value: string, country: Country): string => {
      // Remove all non-digit characters
      const digits = value.replace(/\D/g, "");

      // Apply formatting based on country format
      let formatted = country.format;
      let digitIndex = 0;

      for (let i = 0; i < formatted.length && digitIndex < digits.length; i++) {
        if (formatted[i] === "#") {
          formatted =
            formatted.substring(0, i) +
            digits[digitIndex] +
            formatted.substring(i + 1);
          digitIndex++;
        }
      }

      // Remove remaining # characters
      formatted = formatted.replace(/#/g, "");

      // If there are remaining digits after applying the format, append them
      if (digitIndex < digits.length) {
        const remainingDigits = digits.substring(digitIndex);
        // Add a space before remaining digits if the formatted string doesn't end with a space or dash
        const separator =
          formatted.length > 0 && !formatted.match(/[\s-]$/) ? " " : "";
        formatted = formatted + separator + remainingDigits;
      }

      return formatted;
    },
    [],
  );

  const handleCountryChange = useCallback(
    (country: Country) => {
      setSelectedCountry(country);
      const formattedNumber = formatPhoneNumber(phoneNumber, country);
      const fullPhoneNumber = `${country.dialCode} ${formattedNumber}`;
      setValue(name, fullPhoneNumber);
    },
    [phoneNumber, formatPhoneNumber, setValue, name],
  );

  const handlePhoneChange = useCallback(
    (value: string) => {
      setPhoneNumber(value);
      const formattedNumber = formatPhoneNumber(value, selectedCountry);
      const fullPhoneNumber = `${selectedCountry.dialCode} ${formattedNumber}`;
      setValue(name, fullPhoneNumber);
    },
    [selectedCountry, formatPhoneNumber, setValue, name],
  );

  return {
    countries,
    selectedCountry,
    phoneNumber,
    handleCountryChange,
    handlePhoneChange,
  };
};
