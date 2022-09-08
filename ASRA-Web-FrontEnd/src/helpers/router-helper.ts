import { Fragment } from "react";
import { SCREEN_LAYOUT } from "../commons/constants";
import { DefaultLayout, HeaderOnlyLayout } from "../components/Layout";
import { Router } from "../models/Router";

function handleLayoutScreen(layoutType: string): JSX.Element | any {
  let Layout: JSX.Element | any;
  let FragmentLayout = Fragment;

  switch (layoutType) {
    // Header and Footerzw
    case SCREEN_LAYOUT.DEFAULT_LAYOUT:
      Layout = DefaultLayout;
      break;
    // Header
    case SCREEN_LAYOUT.HEADER_ONLY_LAYOUT:
      Layout = HeaderOnlyLayout;
      break;
    //
    case SCREEN_LAYOUT.FRAGMENT_LAYOUT:
      Layout = FragmentLayout;
      break;
  }

  return Layout;
}

export function handleGetInfoRoute(route: any) {
  let routeInfo: Router = {
    Page: null,
    Layout: null,
    path: "",
  };
  routeInfo.Page = route.component;
  routeInfo.path = route.path;
  routeInfo.Layout = handleLayoutScreen(route.layout);
  return routeInfo;
}
