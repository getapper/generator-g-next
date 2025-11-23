class DomNavigationClass {
  navigate(path: string) {
    window.location.href = path;
  }
}

const domNavigation = new DomNavigationClass();
export default domNavigation;
