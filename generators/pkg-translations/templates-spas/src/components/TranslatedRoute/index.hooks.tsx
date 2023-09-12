import { useNavigate, useParams } from "react-router-dom";
import {Locales} from "@/models/common/Translation";
import { useEffect } from "react";
import domNavigation from "@/models/client/DomNavigation";
import { i18n } from "@/translations/i18nextSetup";

export const useTranslatedRoute = () => {
  const navigate = useNavigate();
  const params = useParams<{ languageCode: Locales }>();

  useEffect(() => {
    domNavigation.navigate = navigate;
    domNavigation.locale = params.languageCode;
    i18n.changeLanguage(domNavigation.locale);
  }, [navigate, params.languageCode]);
};
