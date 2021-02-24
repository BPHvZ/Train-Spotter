<!-- PROJECT SHIELDS -->

[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![GNU License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/BPHvZ/Train-Spotter">
    <img src="readme-images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">TrainSpotter</h3>

  <p align="center">
    Live train and disruption information of the Dutch railroad
    <br />
    <a href="https://bphvz.github.io/Train-Spotter/"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://treinenkaart.bartvanzeist.nl">treinenkaart.bartvanzeist.nl</a>
    ·
    <a href="https://github.com/BPHvZ/Train-Spotter/issues">Report Bug</a>
    ·
    <a href="https://github.com/BPHvZ/Train-Spotter/issues">Request Feature</a>
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
    ```sh
    yarn run serve
    ```

<!-- ROADMAP -->

## Roadmap

See the [Project on GitHub](https://github.com/BPHvZ/Train-Spotter/projects/1) for a list of proposed features (and known issues).

<!-- LICENSE -->

## License

Distributed under the GNU v3 License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Bart van Zeist - [LinkedIn][linkedin-url] - bartvanzeist2000@gmail.com

Project Link: [https://github.com/BPHvZ/Train-Spotter](https://github.com/BPHvZ/Train-Spotter)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[forks-shield]: https://img.shields.io/github/forks/BPHvZ/repo.svg?style=for-the-badge
[forks-url]: https://github.com/BPHvZ/repo/network/members
[stars-shield]: https://img.shields.io/github/stars/BPHvZ/repo.svg?style=for-the-badge
[stars-url]: https://github.com/BPHvZ/repo/stargazers
[issues-shield]: https://img.shields.io/github/issues/BPHvZ/repo.svg?style=for-the-badge
[issues-url]: https://github.com/BPHvZ/repo/issues
[license-shield]: https://img.shields.io/github/license/BPHvZ/repo.svg?style=for-the-badge
[license-url]: https://github.com/BPHvZ/repo/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/bart-van-zeist-543442193
[product-screenshot]: readme-images/trainspotter.png
