import Swal from 'sweetalert2'


export const NavBar = () => {
  function backToHome() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const handleInfo = () => {
    Swal.fire({
        title: 'DeployMate',
        text: 'DeployMate is a tool that leverages Golang for Backend & TypeScript for Frontend, designed to streamline the creation of deployment files for Python projects. Developed by Hamza Kurdi & Chukwuma Okoroji. ©2024',
        icon: 'info',
        confirmButtonText: 'Continue',
      });
  } 

  return (
    <div className="navbar bg-gradient-to-r from-blue-700 to-blue-800 text-white shadow-lg p-4">
      <div className="flex-1">
        <button
          className="text-2xl font-bold tracking-wide font-mono"
          onClick={() => backToHome()}
        >
          {" "}
          DeployMate{" "}
        </button>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end pl-[0.78rem] pt-[0.79rem] btn-circle btn-ghost">
          <button onClick={handleInfo}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="fill-white"
              x="0px"
              y="0px"
              width="20"
              height="20"
              viewBox="0 0 50 50"
            >
              <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
