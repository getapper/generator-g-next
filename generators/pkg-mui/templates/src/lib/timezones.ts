// Timezone data with location names (without GMT offset prefix)
export const timezones = [
  { value: "Etc/GMT+12", label: "International Date Line West" },
  { value: "Etc/GMT+11", label: "Coordinated Universal Time-11" },
  { value: "Pacific/Midway", label: "Midway" },
  { value: "Pacific/Niue", label: "Niue" },
  { value: "Pacific/Pago_Pago", label: "Pago Pago" },
  { value: "Pacific/Samoa", label: "Samoa" },
  { value: "America/Adak", label: "Adak" },
  { value: "Pacific/Rarotonga", label: "Rarotonga" },
  { value: "Pacific/Tahiti", label: "Tahiti" },
  { value: "Pacific/Honolulu", label: "Hawaii" },
  { value: "Pacific/Marquesas", label: "Marquesas Islands" },
  { value: "America/Anchorage", label: "Alaska" },
  { value: "Pacific/Gambier", label: "Gambier" },
  { value: "America/Juneau", label: "Juneau" },
  { value: "America/Nome", label: "Nome" },
  { value: "America/Metlakatla", label: "Metlakatla" },
  { value: "America/Sitka", label: "Sitka" },
  { value: "America/Yakutat", label: "Yakutat" },
  { value: "America/Tijuana", label: "Baja California" },
  { value: "America/Los_Angeles", label: "Pacific Time (US & Canada)" },
  { value: "Pacific/Pitcairn", label: "Pitcairn" },
  { value: "America/Creston", label: "Creston" },
  { value: "America/Chihuahua", label: "Chihuahua, Mazatlan" },
  { value: "America/Dawson", label: "Dawson" },
  { value: "America/Dawson_Creek", label: "Dawson Creek" },
  { value: "America/Denver", label: "Mountain Time (US & Canada)" },
  { value: "America/Ensenada", label: "Ensenada" },
  { value: "America/Fort_Nelson", label: "Fort Nelson" },
  { value: "America/Hermosillo", label: "Hermosillo" },
  { value: "America/Vancouver", label: "Vancouver" },
  { value: "America/Whitehorse", label: "Whitehorse" },
  { value: "America/Phoenix", label: "Arizona" },
  { value: "America/Bahia_Banderas", label: "Bahia Banderas" },
  { value: "America/Belize", label: "Belize" },
  { value: "America/Boise", label: "Boise" },
  { value: "America/Costa_Rica", label: "Costa Rica" },
  { value: "America/Chicago", label: "Central Time (US & Canada)" },
  { value: "America/Edmonton", label: "Edmonton" },
  { value: "America/El_Salvador", label: "El Salvador" },
  { value: "America/Guatemala", label: "Central America" },
  { value: "America/Managua", label: "Managua" },
  { value: "America/Mazatlan", label: "Mazatlan" },
  { value: "America/Ojinaga", label: "Ojinaga" },
  { value: "America/Swift_Current", label: "Swift Current" },
  { value: "America/Tegucigalpa", label: "Tegucigalpa" },
  {
    value: "America/Mexico_City",
    label: "Guadalajara, Mexico City, Monterrey",
  },
  { value: "America/Regina", label: "Saskatchewan" },
  { value: "Pacific/Galapagos", label: "Galapagos" },
  { value: "America/Atikokan", label: "Atikokan" },
  { value: "America/Bogota", label: "Bogota, Lima, Quito" },
  { value: "America/Cancun", label: "Cancun" },
  { value: "America/Cayman", label: "Cayman" },
  { value: "America/Coral_Harbour", label: "Coral Harbour" },
  { value: "America/Eirunepe", label: "Eirunepe" },
  { value: "America/Guayaquil", label: "Guayaquil" },
  { value: "America/Indianapolis", label: "Indiana (East)" },
  { value: "America/Jamaica", label: "Jamaica" },
  { value: "America/Lima", label: "Lima" },
  { value: "America/Matamoros", label: "Matamoros" },
  { value: "America/Menominee", label: "Menominee" },
  { value: "America/Merida", label: "Merida" },
  { value: "America/Monterrey", label: "Monterrey" },
  { value: "America/Nipigon", label: "Nipigon" },
  { value: "America/Panama", label: "Panama" },
  { value: "America/Rainy_River", label: "Rainy River" },
  { value: "America/Rio_Branco", label: "Rio Branco" },
  { value: "America/Thunder_Bay", label: "Thunder Bay" },
  { value: "America/Winnipeg", label: "Winnipeg" },
  { value: "America/New_York", label: "Eastern Time (US & Canada)" },
  { value: "Pacific/Easter", label: "Easter" },
  { value: "America/Caracas", label: "Caracas" },
  { value: "America/Anguilla", label: "Anguilla" },
  { value: "America/Antigua", label: "Antigua" },
  { value: "America/Aruba", label: "Aruba" },
  { value: "America/Asuncion", label: "Asuncion" },
  { value: "America/Barbados", label: "Barbados" },
  { value: "America/Boa_Vista", label: "Boa Vista" },
  { value: "America/Campo_Grande", label: "Campo Grande" },
  { value: "America/Curacao", label: "Curacao" },
  { value: "America/Cuiaba", label: "Cuiaba" },
  { value: "America/Detroit", label: "Detroit" },
  { value: "America/Dominica", label: "Dominica" },
  { value: "America/Grand_Turk", label: "Grand Turk" },
  { value: "America/Grenada", label: "Grenada" },
  { value: "America/Guadeloupe", label: "Guadeloupe" },
  { value: "America/Guyana", label: "Guyana" },
  { value: "America/Halifax", label: "Atlantic Time (Canada)" },
  { value: "America/Havana", label: "Havana" },
  { value: "America/La_Paz", label: "Georgetown, La Paz, Manaus, San Juan" },
  { value: "America/Manaus", label: "Manaus" },
  { value: "America/Martinique", label: "Martinique" },
  { value: "America/Montreal", label: "Montreal" },
  { value: "America/Montserrat", label: "Montserrat" },
  { value: "America/Nassau", label: "Nassau" },
  { value: "America/Port_of_Spain", label: "Port of Spain" },
  { value: "America/Porto_Velho", label: "Porto Velho" },
  { value: "America/Puerto_Rico", label: "Puerto Rico" },
  { value: "America/Santo_Domingo", label: "Santo Domingo" },
  { value: "America/St_Kitts", label: "St. Kitts" },
  { value: "America/St_Lucia", label: "St. Lucia" },
  { value: "America/St_Thomas", label: "St. Thomas" },
  { value: "America/St_Vincent", label: "St. Vincent" },
  { value: "America/Toronto", label: "Toronto" },
  { value: "America/Tortola", label: "Tortola" },
  { value: "America/Santiago", label: "Santiago" },
  { value: "America/St_Johns", label: "Newfoundland" },
  { value: "America/Araguaina", label: "Araguaina" },
  { value: "America/Bahia", label: "Bahia" },
  { value: "America/Belem", label: "Belem" },
  { value: "America/Buenos_Aires", label: "Buenos Aires" },
  { value: "America/Cayenne", label: "Cayenne, Fortaleza" },
  { value: "America/Fortaleza", label: "Fortaleza" },
  { value: "America/Glace_Bay", label: "Glace Bay" },
  { value: "America/Goose_Bay", label: "Goose Bay" },
  { value: "America/Godthab", label: "Greenland" },
  { value: "America/Maceio", label: "Maceio" },
  { value: "America/Moncton", label: "Moncton" },
  { value: "America/Paramaribo", label: "Paramaribo" },
  { value: "America/Punta_Arenas", label: "Punta Arenas" },
  { value: "America/Recife", label: "Recife" },
  { value: "America/Rosario", label: "Rosario" },
  { value: "America/Santarem", label: "Santarem" },
  { value: "America/Thule", label: "Thule" },
  { value: "America/Montevideo", label: "Montevideo" },
  { value: "America/Sao_Paulo", label: "Brasilia" },
  { value: "Antarctica/Rothera", label: "Rothera" },
  { value: "Atlantic/Bermuda", label: "Bermuda" },
  { value: "Atlantic/Stanley", label: "Stanley" },
  { value: "America/Miquelon", label: "Miquelon" },
  { value: "America/Noronha", label: "Noronha" },
  { value: "Atlantic/South_Georgia", label: "South Georgia" },
  { value: "Etc/GMT+2", label: "Coordinated Universal Time-02" },
  { value: "Atlantic/Azores", label: "Azores" },
  { value: "Atlantic/Cape_Verde", label: "Cape Verde" },
  { value: "UTC", label: "Default" },
  { value: "America/Danmarkshavn", label: "Danmarkshavn" },
  { value: "America/Scoresbysund", label: "Scoresbysund" },
  { value: "Africa/Accra", label: "Accra" },
  { value: "Africa/Abidjan", label: "Abidjan" },
  { value: "Africa/Bamako", label: "Bamako" },
  { value: "Africa/Banjul", label: "Banjul" },
  { value: "Africa/Bissau", label: "Bissau" },
  { value: "Africa/Conakry", label: "Conakry" },
  { value: "Africa/Dakar", label: "Dakar" },
  { value: "Africa/El_Aaiun", label: "El Aaiun" },
  { value: "Africa/Freetown", label: "Freetown" },
  { value: "Africa/Lome", label: "Lome" },
  { value: "Africa/Monrovia", label: "Monrovia" },
  { value: "Africa/Nouakchott", label: "Nouakchott" },
  { value: "Africa/Ouagadougou", label: "Ouagadougou" },
  { value: "Africa/Sao_Tome", label: "Sao Tome" },
  { value: "Africa/Timbuktu", label: "Timbuktu" },
  { value: "Antarctica/Troll", label: "Troll" },
  { value: "Atlantic/St_Helena", label: "St. Helena" },
  { value: "Atlantic/Reykjavik", label: "Monrovia, Reykjavik" },
  {
    value: "Europe/London",
    label: "Greenwich Mean Time, Dublin, Edinburgh, Lisbon, London",
  },
  { value: "Africa/Bangui", label: "Bangui" },
  { value: "Africa/Casablanca", label: "Casablanca" },
  { value: "Africa/Algiers", label: "Algiers" },
  { value: "Africa/Brazzaville", label: "Brazzaville" },
  { value: "Africa/Douala", label: "Douala" },
  { value: "Africa/Kinshasa", label: "Kinshasa" },
  { value: "Africa/Libreville", label: "Libreville" },
  { value: "Africa/Luanda", label: "Luanda" },
  { value: "Africa/Malabo", label: "Malabo" },
  { value: "Africa/Ndjamena", label: "Ndjamena" },
  { value: "Africa/Niamey", label: "Niamey" },
  { value: "Africa/Tunis", label: "Tunis" },
  { value: "Africa/Lagos", label: "West Central Africa" },
  { value: "Atlantic/Canary", label: "Canary" },
  { value: "Atlantic/Faroe", label: "Faroe" },
  { value: "Atlantic/Madeira", label: "Madeira" },
  { value: "Europe/Belfast", label: "Belfast" },
  {
    value: "Europe/Berlin",
    label: "Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
  },
  {
    value: "Europe/Budapest",
    label: "Belgrade, Bratislava, Budapest, Ljubljana, Prague",
  },
  { value: "Europe/Dublin", label: "Dublin" },
  { value: "Europe/Guernsey", label: "Guernsey" },
  { value: "Europe/Isle_of_Man", label: "Isle of Man" },
  { value: "Europe/Jersey", label: "Jersey" },
  { value: "Europe/Lisbon", label: "Lisbon" },
  { value: "Europe/Paris", label: "Brussels, Copenhagen, Madrid, Paris" },
  { value: "Europe/Warsaw", label: "Sarajevo, Skopje, Warsaw, Zagreb" },
  { value: "Africa/Blantyre", label: "Blantyre" },
  { value: "Africa/Bujumbura", label: "Bujumbura" },
  { value: "Africa/Cairo", label: "Cairo" },
  { value: "Africa/Ceuta", label: "Ceuta" },
  { value: "Africa/Johannesburg", label: "Johannesburg" },
  { value: "Africa/Gaborone", label: "Gaborone" },
  { value: "Africa/Harare", label: "Harare" },
  { value: "Africa/Khartoum", label: "Khartoum" },
  { value: "Africa/Kigali", label: "Kigali" },
  { value: "Africa/Lubumbashi", label: "Lubumbashi" },
  { value: "Africa/Lusaka", label: "Lusaka" },
  { value: "Africa/Maputo", label: "Maputo" },
  { value: "Africa/Maseru", label: "Maseru" },
  { value: "Africa/Mbabane", label: "Mbabane" },
  { value: "Africa/Tripoli", label: "Tripoli" },
  { value: "Africa/Windhoek", label: "Windhoek" },
  { value: "Asia/Amman", label: "Amman" },
  { value: "Asia/Beirut", label: "Beirut" },
  { value: "Asia/Damascus", label: "Damascus" },
  { value: "Asia/Jerusalem", label: "Jerusalem" },
  { value: "Europe/Amsterdam", label: "Amsterdam" },
  { value: "Europe/Andorra", label: "Andorra" },
  { value: "Europe/Belgrade", label: "Belgrade" },
  { value: "Europe/Brussels", label: "Brussels" },
  { value: "Europe/Copenhagen", label: "Copenhagen" },
  { value: "Europe/Gibraltar", label: "Gibraltar" },
  { value: "Europe/Istanbul", label: "Athens, Bucharest, Istanbul" },
  { value: "Europe/Kaliningrad", label: "Kaliningrad" },
  {
    value: "Europe/Kiev",
    label: "Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius",
  },
  { value: "Europe/Ljubljana", label: "Ljubljana" },
  { value: "Europe/Luxembourg", label: "Luxembourg" },
  { value: "Europe/Madrid", label: "Madrid" },
  { value: "Europe/Malta", label: "Malta" },
  { value: "Europe/Monaco", label: "Monaco" },
  { value: "Europe/Minsk", label: "Minsk" },
  { value: "Europe/Oslo", label: "Oslo" },
  { value: "Europe/Prague", label: "Prague" },
  { value: "Europe/Rome", label: "Rome" },
  { value: "Europe/Sarajevo", label: "Sarajevo" },
  { value: "Europe/Skopje", label: "Skopje" },
  { value: "Europe/Stockholm", label: "Stockholm" },
  { value: "Europe/Tirane", label: "Tirane" },
  { value: "Europe/Vaduz", label: "Vaduz" },
  { value: "Europe/Vienna", label: "Vienna" },
  { value: "Europe/Zagreb", label: "Zagreb" },
  { value: "Europe/Zurich", label: "Zurich" },
  { value: "Africa/Addis_Ababa", label: "Addis Ababa" },
  { value: "Africa/Asmara", label: "Asmara" },
  { value: "Africa/Dar_es_Salaam", label: "Dar es Salaam" },
  { value: "Africa/Djibouti", label: "Djibouti" },
  { value: "Africa/Juba", label: "Juba" },
  { value: "Africa/Kampala", label: "Kampala" },
  { value: "Africa/Mogadishu", label: "Mogadishu" },
  { value: "Africa/Nairobi", label: "Nairobi" },
  { value: "Asia/Aden", label: "Aden" },
  { value: "Asia/Bahrain", label: "Bahrain" },
  { value: "Asia/Baghdad", label: "Baghdad" },
  { value: "Asia/Famagusta", label: "Famagusta" },
  { value: "Asia/Gaza", label: "Gaza" },
  { value: "Asia/Hebron", label: "Hebron" },
  { value: "Asia/Kuwait", label: "Kuwait" },
  { value: "Asia/Nicosia", label: "Nicosia" },
  { value: "Asia/Qatar", label: "Qatar" },
  { value: "Asia/Tel_Aviv", label: "Tel Aviv" },
  { value: "Asia/Riyadh", label: "Kuwait, Riyadh" },
  { value: "Europe/Athens", label: "Athens" },
  { value: "Europe/Bucharest", label: "Bucharest" },
  { value: "Europe/Chisinau", label: "Chisinau" },
  { value: "Europe/Helsinki", label: "Helsinki" },
  { value: "Europe/Kirov", label: "Kirov" },
  { value: "Europe/Moscow", label: "Moscow, St. Petersburg, Volgograd" },
  { value: "Europe/Riga", label: "Riga" },
  { value: "Europe/Simferopol", label: "Simferopol" },
  { value: "Europe/Sofia", label: "Sofia" },
  { value: "Europe/Tallinn", label: "Tallinn" },
  { value: "Europe/Tiraspol", label: "Tiraspol" },
  { value: "Europe/Uzhgorod", label: "Uzhgorod" },
  { value: "Europe/Vilnius", label: "Vilnius" },
  { value: "Europe/Volgograd", label: "Volgograd" },
  { value: "Europe/Zaporozhye", label: "Zaporozhye" },
  { value: "Indian/Antananarivo", label: "Antananarivo" },
  { value: "Indian/Comoro", label: "Comoro" },
  { value: "Indian/Mayotte", label: "Mayotte" },
  { value: "Asia/Tehran", label: "Tehran" },
  { value: "Asia/Baku", label: "Baku" },
  { value: "Asia/Muscat", label: "Muscat" },
  { value: "Asia/Dubai", label: "Abu Dhabi, Muscat" },
  { value: "Asia/Tbilisi", label: "Tbilisi" },
  { value: "Asia/Yerevan", label: "Yerevan" },
  { value: "Europe/Astrakhan", label: "Astrakhan" },
  { value: "Europe/Samara", label: "Samara" },
  { value: "Europe/Saratov", label: "Saratov" },
  { value: "Europe/Ulyanovsk", label: "Ulyanovsk" },
  { value: "Indian/Mahe", label: "Mahe" },
  { value: "Indian/Mauritius", label: "Port Louis" },
  { value: "Indian/Reunion", label: "Reunion" },
  { value: "Asia/Kabul", label: "Kabul" },
  { value: "Antarctica/Mawson", label: "Mawson" },
  { value: "Asia/Aqtau", label: "Aqtau" },
  { value: "Asia/Aqtobe", label: "Aqtobe" },
  { value: "Asia/Ashgabat", label: "Ashgabat" },
  { value: "Asia/Atyrau", label: "Atyrau" },
  { value: "Asia/Dushanbe", label: "Dushanbe" },
  { value: "Asia/Oral", label: "Oral" },
  { value: "Asia/Samarkand", label: "Samarkand" },
  { value: "Asia/Karachi", label: "Islamabad, Karachi" },
  { value: "Asia/Tashkent", label: "Tashkent" },
  { value: "Asia/Yekaterinburg", label: "Yekaterinburg" },
  { value: "Indian/Maldives", label: "Maldives" },
  { value: "Asia/Calcutta", label: "Chennai, Kolkata, Mumbai, New Delhi" },
  { value: "Asia/Colombo", label: "Sri Jayawardenepura" },
  { value: "Asia/Kolkata", label: "Kolkata" },
  { value: "Asia/Kathmandu", label: "Kathmandu" },
  { value: "Asia/Almaty", label: "Astana" },
  { value: "Asia/Bishkek", label: "Bishkek" },
  { value: "Asia/Kashgar", label: "Kashgar" },
  { value: "Asia/Omsk", label: "Omsk" },
  { value: "Asia/Qyzylorda", label: "Qyzylorda" },
  { value: "Asia/Thimphu", label: "Thimphu" },
  { value: "Asia/Urumqi", label: "Urumqi" },
  { value: "Asia/Dhaka", label: "Dhaka" },
  { value: "Asia/Novosibirsk", label: "Novosibirsk" },
  { value: "Indian/Chagos", label: "Chagos" },
  { value: "Asia/Yangon", label: "Yangon" },
  { value: "Asia/Rangoon", label: "Yangon (Rangoon)" },
  { value: "Indian/Cocos", label: "Cocos" },
  { value: "Antarctica/Davis", label: "Davis" },
  { value: "Asia/Barnaul", label: "Barnaul" },
  { value: "Asia/Bangkok", label: "Bangkok, Hanoi, Jakarta" },
  { value: "Asia/Ho_Chi_Minh", label: "Ho Chi Minh" },
  { value: "Asia/Hovd", label: "Hovd" },
  { value: "Asia/Jakarta", label: "Jakarta" },
  { value: "Asia/Novokuznetsk", label: "Novokuznetsk" },
  { value: "Asia/Phnom_Penh", label: "Phnom Penh" },
  { value: "Asia/Pontianak", label: "Pontianak" },
  { value: "Asia/Tomsk", label: "Tomsk" },
  { value: "Asia/Vientiane", label: "Vientiane" },
  { value: "Asia/Krasnoyarsk", label: "Krasnoyarsk" },
  { value: "Indian/Christmas", label: "Christmas" },
  { value: "Antarctica/Casey", label: "Casey" },
  { value: "Asia/Brunei", label: "Brunei" },
  { value: "Asia/Choibalsan", label: "Choibalsan" },
  { value: "Asia/Chongqing", label: "Chongqing" },
  { value: "Asia/Harbin", label: "Harbin" },
  { value: "Asia/Hong_Kong", label: "Hong Kong" },
  { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur" },
  { value: "Asia/Kuching", label: "Kuching" },
  { value: "Asia/Macau", label: "Macau" },
  { value: "Asia/Makassar", label: "Makassar" },
  { value: "Asia/Manila", label: "Manila" },
  { value: "Asia/Irkutsk", label: "Irkutsk" },
  { value: "Asia/Shanghai", label: "Beijing, Chongqing, Hong Kong, Urumqi" },
  { value: "Asia/Singapore", label: "Kuala Lumpur, Singapore" },
  { value: "Asia/Taipei", label: "Taipei" },
  { value: "Asia/Ulaanbaatar", label: "Ulaanbaatar" },
  { value: "Australia/Perth", label: "Perth" },
  { value: "Asia/Pyongyang", label: "Pyongyang" },
  { value: "Australia/Eucla", label: "Eucla" },
  { value: "Asia/Chita", label: "Chita" },
  { value: "Asia/Dili", label: "Dili" },
  { value: "Asia/Jayapura", label: "Jayapura" },
  { value: "Asia/Khandyga", label: "Khandyga" },
  { value: "Asia/Tokyo", label: "Osaka, Sapporo, Tokyo" },
  { value: "Asia/Seoul", label: "Seoul" },
  { value: "Asia/Yakutsk", label: "Yakutsk" },
  { value: "Pacific/Palau", label: "Palau" },
  { value: "Australia/Adelaide", label: "Adelaide" },
  { value: "Australia/Broken_Hill", label: "Broken Hill" },
  { value: "Australia/Darwin", label: "Darwin" },
  { value: "Australia/Brisbane", label: "Brisbane" },
  { value: "Asia/Vladivostok", label: "Vladivostok" },
  { value: "Australia/Hobart", label: "Hobart" },
  { value: "Australia/Lindeman", label: "Lindeman" },
  { value: "Pacific/Chuuk", label: "Chuuk" },
  { value: "Pacific/Saipan", label: "Saipan" },
  { value: "Pacific/Port_Moresby", label: "Guam, Port Moresby" },
  { value: "Australia/LHI", label: "Lord Howe Island" },
  { value: "Australia/Lord_Howe", label: "Lord Howe Island" },
  { value: "Asia/Sakhalin", label: "Sakhalin" },
  { value: "Asia/Srednekolymsk", label: "Srednekolymsk" },
  { value: "Asia/Magadan", label: "Magadan, Solomon Is., New Caledonia" },
  { value: "Australia/Currie", label: "Currie" },
  { value: "Australia/Melbourne", label: "Melbourne" },
  { value: "Australia/Sydney", label: "Sydney" },
  { value: "Pacific/Efate", label: "Efate" },
  { value: "Pacific/Bougainville", label: "Bougainville" },
  { value: "Pacific/Guadalcanal", label: "Guadalcanal" },
  { value: "Pacific/Kosrae", label: "Kosrae" },
  { value: "Pacific/Norfolk", label: "Norfolk" },
  { value: "Pacific/Noumea", label: "Noumea" },
  { value: "Pacific/Pohnpei", label: "Pohnpei" },
  { value: "Asia/Anadyr", label: "Anadyr" },
  { value: "Asia/Kamchatka", label: "Petropavlovsk-Kamchatsky" },
  { value: "Etc/GMT-12", label: "Coordinated Universal Time+12" },
  { value: "Pacific/Funafuti", label: "Funafuti" },
  { value: "Pacific/Kwajalein", label: "Kwajalein" },
  { value: "Pacific/Majuro", label: "Majuro" },
  { value: "Pacific/Nauru", label: "Nauru" },
  { value: "Pacific/Tarawa", label: "Tarawa" },
  { value: "Pacific/Wake", label: "Wake" },
  { value: "Pacific/Wallis", label: "Wallis" },
  { value: "Pacific/Auckland", label: "Auckland, Wellington" },
  { value: "Pacific/Fiji", label: "Fiji" },
  { value: "Pacific/Chatham", label: "Chatham Islands" },
  { value: "Pacific/Enderbury", label: "Phoenix Islands, Tokelau, Tonga" },
  { value: "Pacific/Fakaofo", label: "Fakaofo" },
  { value: "Pacific/Tongatapu", label: "Tongatapu" },
  { value: "Pacific/Apia", label: "Apia" },
  { value: "Pacific/Kiritimati", label: "Line Islands" },
];

/**
 * Gets the GMT offset in hours for a timezone string
 * @param timezone - The timezone string (e.g., "America/Managua", "US/Eastern")
 * @returns Offset in hours (e.g., -6, +5, 0) or 0 if timezone is invalid
 */
export function getTimezoneOffset(timezone: string): number {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en", {
      timeZone: timezone,
      timeZoneName: "longOffset",
    });

    const parts = formatter.formatToParts(now);
    const offsetPart = parts.find(
      (part) => part.type === "timeZoneName",
    )?.value;

    if (offsetPart) {
      // offsetPart is in format like "GMT-06:00" or "GMT+05:30"
      // Extract the sign and hour
      const match = offsetPart.match(/GMT([+-])(\d{2}):(\d{2})/);
      if (match) {
        const sign = match[1] === "+" ? 1 : -1;
        const hours = parseInt(match[2], 10);
        const minutes = parseInt(match[3], 10);
        // Calculate total offset in hours (round to nearest hour for simplicity)
        const totalMinutes = sign * (hours * 60 + minutes);
        return Math.round(totalMinutes / 60);
      }
    }

    return 0;
  } catch (error) {
    console.warn("Error getting timezone offset:", error);
    return 0;
  }
}

/**
 * Converts a timezone offset number to GMT format string
 * @param offset - The offset in hours (e.g., -6, +5, 0)
 * @returns GMT formatted string (e.g., "GMT-6", "GMT+5", "GMT+0")
 */
export function formatOffsetToGMT(offset: number): string {
  if (offset === 0) {
    return "GMT+0";
  }
  const sign = offset >= 0 ? "+" : "";
  return `GMT${sign}${offset}`;
}

/**
 * Converts a timezone string or offset string/number to GMT format
 * @param timezone - The timezone string (e.g., "America/Managua") or offset string (e.g., "-6") or offset number (e.g., -6)
 * @returns GMT formatted string (e.g., "GMT-6", "GMT+5") or "UTC" if timezone is invalid
 */
export function formatTimezoneToGMT(timezone?: string | number): string {
  if (timezone === undefined || timezone === null) {
    return "UTC";
  }

  // If it's a number, it's already an offset
  if (typeof timezone === "number") {
    return formatOffsetToGMT(timezone);
  }

  // If it's a string, check if it's an offset string (e.g., "-6", "+5", "0")
  if (typeof timezone === "string") {
    // Check if it's a numeric string (offset)
    const offsetMatch = timezone.match(/^([+-]?\d+)$/);
    if (offsetMatch) {
      const offsetNum = parseInt(timezone, 10);
      return formatOffsetToGMT(offsetNum);
    }

    // If it's "UTC" or empty, return "UTC"
    if (!timezone || timezone === "UTC") {
      return "UTC";
    }

    // Otherwise, treat it as a timezone string and convert to offset
    const offset = getTimezoneOffset(timezone);
    return formatOffsetToGMT(offset);
  }

  return "UTC";
}

/**
 * Gets a timezone string from an offset string
 * Returns the first timezone that matches the offset
 * @param offset - The offset as string (e.g., "-6", "+5", "0")
 * @returns A timezone string (e.g., "America/Managua") or "UTC" if not found
 */
export function getTimezoneFromOffset(offset: string | number): string {
  // Convert string to number if needed
  const offsetNum = typeof offset === "string" ? parseInt(offset, 10) : offset;
  const grouped = groupTimezonesByOffset();
  const timezones = grouped.get(offsetNum);
  if (timezones && timezones.length > 0) {
    return timezones[0]; // Return first timezone with this offset
  }
  return "UTC";
}

/**
 * Extracts location name from timezone label (removes GMT offset part)
 * @param label - The full label like "(GMT-06:00) Guadalajara, Mexico City, Monterrey"
 * @returns Location name like "Guadalajara, Mexico City, Monterrey"
 */
function extractLocationName(label: string): string {
  // Remove the GMT offset part (everything before and including the closing parenthesis)
  const match = label.match(/\)\s*(.+)$/);
  return match ? match[1].trim() : label;
}

/**
 * Gets location name for a timezone
 * @param timezoneValue - The timezone ID (e.g., "America/Mexico_City")
 * @returns Location name (e.g., "Guadalajara, Mexico City, Monterrey")
 */
function getLocationName(timezoneValue: string): string {
  const tz = timezones.find((t) => t.value === timezoneValue);
  if (tz) {
    return tz.label; // Labels already contain only location names
  }
  // Fallback: use timezone ID as location name
  return timezoneValue;
}

/**
 * Groups timezones by their GMT offset
 * @returns Map of offset -> array of timezone names
 */
export function groupTimezonesByOffset(): Map<number, string[]> {
  const grouped = new Map<number, string[]>();

  timezones.forEach((tz) => {
    const offset = getTimezoneOffset(tz.value);
    if (!grouped.has(offset)) {
      grouped.set(offset, []);
    }
    grouped.get(offset)!.push(tz.value);
  });

  return grouped;
}

/**
 * Gets timezone options grouped by offset
 * @returns Array of options with offset as string value and formatted label
 */
export function getTimezoneOptionsByOffset(): Array<{
  value: string;
  label: string;
}> {
  const grouped = groupTimezonesByOffset();
  const options: Array<{ value: string; label: string }> = [];

  // Sort offsets from -12 to +13
  const sortedOffsets = Array.from(grouped.keys()).sort((a, b) => a - b);

  sortedOffsets.forEach((offset) => {
    const timezoneIds = grouped.get(offset)!;
    const gmtLabel = formatOffsetToGMT(offset);
    // Get location names instead of timezone IDs
    const locationNames = timezoneIds.map(getLocationName);
    const label = `${gmtLabel}: ${locationNames.join(", ")}`;
    // Convert offset to string (e.g., -6 -> "-6", +5 -> "+5", 0 -> "0")
    const offsetString = offset >= 0 ? `+${offset}` : `${offset}`;
    options.push({ value: offsetString, label });
  });

  return options;
}
