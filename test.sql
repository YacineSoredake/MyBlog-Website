-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 13 août 2024 à 03:17
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `test`
--

-- --------------------------------------------------------

--
-- Structure de la table `blogs`
--

CREATE TABLE `blogs` (
  `id` int(3) NOT NULL,
  `title` longtext NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp(),
  `field` longtext NOT NULL,
  `description` longtext NOT NULL,
  `author` int(3) NOT NULL,
  `image` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Déchargement des données de la table `blogs`
--

INSERT INTO `blogs` (`id`, `title`, `date`, `field`, `description`, `author`, `image`) VALUES
(24, 'Microsoft crash ', '2024-07-20', 'softaware engennering', 'microsoft bug ended the day with loses counted by several millions lol', 50, '1721434919526-unnamed.jpg'),
(25, 'BLOCKCHAIN technology', '2024-07-21', 'developpment', 'blockchain is sisperced data based structure ', 50, '1721584127360-tÃ©lÃ©chargement.jpeg'),
(26, 'How to get the right rotation', '2024-07-23', 'Jungling', 'todays meta is highly based on assassins since the last update hayabusa became one of the best heros in jungle lol', 68, '1721691336088-1345041.png');

-- --------------------------------------------------------

--
-- Structure de la table `profile`
--

CREATE TABLE `profile` (
  `matricule` int(3) DEFAULT NULL,
  `FullName` longtext DEFAULT NULL,
  `PreOccupation` longtext DEFAULT NULL,
  `image` longtext NOT NULL DEFAULT 'unknown2-svgrepo-com.svg'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Déchargement des données de la table `profile`
--

INSERT INTO `profile` (`matricule`, `FullName`, `PreOccupation`, `image`) VALUES
(50, 'Blaha Mohammed', 'web developement', '1721693002228-Shinei Nouzen.png'),
(51, 'kk', 'kk', '1721449215831-unnamed.jpg'),
(52, 'kjkj', 'kjkj', ''),
(53, 'shinei nouzen', 'handler one', '1721449363572-Aizen.jpeg'),
(54, 'lklk', 'lkl', ''),
(55, 'lklk', 'lkl', ''),
(56, 'lklk', 'lkl', '1721449462688-tÃ©lÃ©chargement.png'),
(57, 'llklkl', 'lkk', '1721449492615-1_RvUzEHQi5JEifWCBY4Rkng.webp'),
(58, 'kkj', 'kjkj', '1721449746384-unnamed.jpg'),
(59, '', '', ''),
(60, 'lklklklkklk', 'lklk', '1721449967313-tÃ©lÃ©chargement.png'),
(61, 'lklklk', 'lklk', '1721450192597-tÃ©lÃ©chargement.jpeg'),
(62, 'blha yacnoen', 'designer', ''),
(63, 'oaoaoo', 'papap', 'unknown2-svgrepo-com.svg'),
(64, 'your_fullname', 'your_occupation', 'unknown2-svgrepo-com.svg'),
(65, NULL, NULL, 'unknown2-svgrepo-com.svg'),
(66, NULL, NULL, 'unknown2-svgrepo-com.svg'),
(67, 'klklk', 'lklk', 'unknown2-svgrepo-com.svg'),
(68, 'hayabusan ninja', 'jungler', 'unknown2-svgrepo-com.svg');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(3) NOT NULL,
  `username` longtext DEFAULT NULL,
  `password` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `username`, `password`) VALUES
(50, 'yacine_blh', '$2b$10$hKZ7OmXpnNkzSA8Xjwx48u8e33Y1dH8AwyPqP6lgARA9j2Vfbor1K'),
(51, 'te', '$2b$10$MI6zt8owmNU905QM.pP7O..abuXGxpG536zsbzUR7ndlCS1ssN25i'),
(52, 'uhjh', '$2b$10$ACj0ZFuXnT/riDFuMVU5D.au.kshCI.BMyObiOxifjmDxlHKisz7e'),
(53, 'shinei_nou', '$2b$10$bhoyZmCNIjMmf2VuyfL5Ie0AQCmtV.ddsD95.7Lqsv7WAQF7dhoJ2'),
(54, 'klklkl', '$2b$10$QIKMVg.wHptzG80ojnSY/O.YD/dXCMhuhvNe65soBDktt1s1hplJa'),
(55, 'klklkl', '$2b$10$IG0qyP5vlBExc9YEN8S37u/dCI19hEwZM9ntwzouUEwOKZjOE0pFW'),
(56, 'klklkl', '$2b$10$s1yHGGqveRVvNI/fjFyxbOd/29kWxz0/D0AyU6p10p/D/wIXU/ys6'),
(57, 'lklkl', '$2b$10$KXpFzEiRiBERFml3hgnqS.nXXNahVgk7UYcbIq/DLWWFAUrUPoyo.'),
(58, 'kjkjk', '$2b$10$ES8HE0nkyncHfZFWoxyz0uG2nyvqXqFsxZ6z1QpRMuWKPSqNUtLuK'),
(59, '', '$2b$10$be/ZNIb/qddYkOzoClm3aeOuoCp3wy9vlIoDnMqI01INwCV2.3646'),
(60, 'lklkl', '$2b$10$EL/Z1oQCdXnSZU6J6s172eTVu2Sk9kvZTaQpYtIIyu7AJpEIZg4va'),
(61, 'lklklklk', '$2b$10$/GvTO.zXGxFyaW9JBimiBeyL7XYLUPlr7nsLUt.RzqPsLnPYpsOhe'),
(62, 'blh', '$2b$10$SNMY.b44ftOcNfi3ykGXmOBq7Xz8I1x3QHx8mJ..7U.D7aZHKGG.G'),
(63, 'testpic', '$2b$10$ISj28olgXxpGYboYg.kKOuTwNSzpKAA5nLbAiNvnvsYvtv2CcEunW'),
(64, 'your_username', '$2b$10$S4emh3dAjrdkXy6hhaYW5uYTyAR9KvjC71PW2x7IaPloz2u5rXvd2'),
(65, 'your_username', '$2b$10$RduflZzhHBNV95fR1bbh0.VU1rCB/Fj20ovEEAS2s7IaQcEsGxMZu'),
(66, 'your_username', '$2b$10$v7buXNfUHDKdA9m0HO/dwOj0fsAsDid4pXAvGTVeqAwGiW1Blojxy'),
(67, 'lklkl', '$2b$10$zyAjCQPqUWj18Cqim6/P..6ZxfZn6qgQ/av1Hmqb55r2zb7q9LgJu'),
(68, 'Hayabusa', '$2b$10$9h2skSPIOz0.ujs5k5Kc2ODGVGuHWa1HP38FUGcrP73ndRyodhwHi');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
