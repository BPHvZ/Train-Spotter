<!-- PROJECT SHIELDS -->

[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Checks][checks-shield]][issues-url]
[![GNU License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/BPHvZ/Train-Spotter">
    <img src="readme-images/logo-blue.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">TrainSpotter</h3>

  <p align="center">
    Live train and disruption information of the Dutch railroad
    <br />
    <a href="https://treinenkaart.bartvanzeist.nl"><strong>TrainSpotter website »</strong></a>
    <br />
    <a href="https://bphvz.github.io/Train-Spotter/"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://treinenkaart.bartvanzeist.nl">treinenkaart.bartvanzeist.nl</a>
    ·
    <a href="https://github.com/BPHvZ/Train-Spotter/issues">Report Bug</a>
    ·
    <a href="https://github.com/BPHvZ/Train-Spotter/issues">Request Feature</a>
·
    <a href="https://bartvanzeist.nl">bartvanzeist.nl</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#trainspotter-1">TrainSpotter</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#specific-technologies">Specific technologies</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#project-management">Project Management</a>
      <ul>
        <li><a href="#feature-management">Feature management</a></li>
        <li><a href="#development">Development</a></li>
        <li><a href="#continuous-integration-and-delivery">Continuous Integration and Delivery</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- TrainSpotter -->

## TrainSpotter

[![TrainSpotter Screen Shot][product-screenshot]](https://example.com)

TrainSpotter is a website that tracks trains on the Dutch railroad in real-time.
TrainSpotter offers features such as:

-   Real-time train tracking
-   Global search for stations, trains, train types, train parts and ride id's
-   Detailed, real-time information for each specific train

### Built With

-   [Angular](https://angular.io/)
-   [MapBox](https://www.mapbox.com/)
-   [Ng-Bootstrap](https://ng-bootstrap.github.io/#/home)
-   [NS API](https://apiportal.ns.nl/)

#### Specific technologies

-   Web Workers (for MapBox and Jimp image manipulation)
-   Service Workers
-   LocalStorage (for content caching)

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

-   Angular
    -   [See Angular docs](https://angular.io/guide/setup-local)
-   Yarn
    ```sh
    npm install --global yarn
    ```

### Installation

1. Clone the repo
    ```sh
    git clone https://github.com/BPHvZ/Train-Spotter.git
    ```
2. Install Yarn packages
    ```sh
    yarn install
    ```
3. Run TrainSpotter
`sh yarn run serve `
   <!-- Project Management -->

## Project Management

#### Feature Management

1. New features are tracked on the [Project board][project-board].
2. When a feature is going into development, it is converted into an Issue.
3. A person is assigned to the Issue. A bot will create a feature branch for the Issue.
    - By default, the feature branch will be based of the `develop` branch.
    - Issues that are labelled as ![bug](https://img.shields.io/github/labels/BPHvZ/Train-Spotter/bug) will be based of the `main` branch.  
      Bugs are intended to be resolved quickly and thus should be implemented on `main` as soon as possible.

#### Development

1. A feature will be developed on its designated feature branch.
2. A pre-commit hook is included which can be enabled by running `yarn husky install`.
    - The pre-commit hook will run [Prettier](https://prettier.io/) and `ng lint` using the linting rules included with this project.
3. [Compodoc](https://compodoc.app/) is used to generate documentation. Compodoc strings should be added before making a pull request.
4. Feature branches can be pushed into the `develop` branch.
5. The `main` branch is protected and only accepts pull requests that have completed the CI/CD tasks successfully.

#### Continuous Integration and Delivery

1. [Teamcity](https://www.jetbrains.com/teamcity/) is run locally.
2. All changes on the `develop` branch will cause the CI to build and deploy the experimental version of TrainSpotter at [betatreinenkaart.bartvanzeist.nl](https://betatreinenkaart.bartvanzeist.nl).
3. Pull requests from the `develop` branch to the `main` branch will build and deploy the new stable version to [treinenkaart.bartvanzeist.nl](https://treinenkaart.bartvanzeist.nl)

<!-- ROADMAP -->

## Roadmap

See the [Project on GitHub][project-board] for a list of proposed features (and known issues).

<!-- LICENSE -->

## License

Distributed under the GNU GPL v3 License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Bart van Zeist - [bartvanzeist.nl](https://bartvanzeist.nl) - [LinkedIn][linkedin-url] - bartvanzeist2000@gmail.com

Project Link: [https://github.com/BPHvZ/Train-Spotter](https://github.com/BPHvZ/Train-Spotter)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[forks-shield]: https://img.shields.io/github/forks/BPHvZ/Train-Spotter.svg?style=for-the-badge
[forks-url]: https://github.com/BPHvZ/Train-Spotter/network/members
[stars-shield]: https://img.shields.io/github/stars/BPHvZ/Train-Spotter.svg?style=for-the-badge
[stars-url]: https://github.com/BPHvZ/Train-Spotter/stargazers
[issues-shield]: https://img.shields.io/github/issues/BPHvZ/Train-Spotter.svg?style=for-the-badge
[issues-url]: https://github.com/BPHvZ/Train-Spotter/issues
[checks-shield]: https://img.shields.io/github/checks-status/BPHvZ/Train-Spotter/main.svg?style=for-the-badge
[license-shield]: https://img.shields.io/badge/License-GPL%20v3-blue.svg?style=for-the-badge
[license-url]: https://github.com/BPHvZ/Train-Spotter/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/bart-van-zeist-543442193
[product-screenshot]: readme-images/trainspotter.png
[project-board]: https://github.com/BPHvZ/Train-Spotter/projects/1
