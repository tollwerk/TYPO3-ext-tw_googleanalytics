<?php

########################################################################
# Extension Manager/Repository config file for ext "tw_googleanalytics".
#
# Auto generated 05-12-2014 13:21
#
# Manual updates:
# Only the data in the array - everything else is removed by next
# writing. "version" and "dependencies" must not be touched!
########################################################################

$EM_CONF[$_EXTKEY] = array(
	'title' => 'tollwerk Google Analytics',
	'description' => '[TYPO3 CMS 7 Release] Frontend plugin for advanced Google Analytics integration with a wide range of features including pageView and event tracking, custom variables, cross domain tracking, tracking of file downloads and external domains and much more. The extension is built on extbase / fluid and supports the asynchronous tracking code only (ga.js). ATTENTION: Support for TYPO3 4.x has been dropped, use the 1.x versions instead!',
	'category' => 'plugin',
	'author' => 'Joschi Kuphal',
	'author_email' => 'joschi@tollwerk.de',
	'author_company' => 'tollwerk® GmbH',
	'shy' => '',
	'priority' => '',
	'module' => '',
	'state' => 'stable',
	'internal' => '',
	'uploadfolder' => 0,
	'createDirs' => '',
	'modify_tables' => '',
	'clearCacheOnLoad' => 0,
	'lockType' => '',
	'version' => '3.0.0',
	'constraints' => array(
		'depends' => array(
			'extbase' => '6.0.0-0.0.0',
			'fluid' => '6.0.0-0.0.0',
			'php' => '5.3.0-0.0.0',
			'typo3' => '6.0.0-7.0.99',
		),
		'conflicts' => array(
		),
		'suggests' => array(
		),
	),
	'_md5_values_when_last_written' => 'a:21:{s:10:"bower.json";s:4:"b1b0";s:12:"ext_icon.gif";s:4:"fb0a";s:17:"ext_localconf.php";s:4:"cd7a";s:14:"ext_tables.php";s:4:"bd13";s:14:"ext_tables.sql";s:4:"194c";s:11:"LICENSE.txt";s:4:"e8c1";s:9:"README.md";s:4:"6c10";s:48:"Classes/Controller/GoogleanalyticsController.php";s:4:"68c7";s:38:"Configuration/TypoScript/constants.txt";s:4:"6b8b";s:34:"Configuration/TypoScript/setup.txt";s:4:"ca9d";s:46:"Resources/Private/Language/de.locallang_db.xlf";s:4:"45a2";s:46:"Resources/Private/Language/fr.locallang_db.xlf";s:4:"dc49";s:40:"Resources/Private/Language/locallang.xlf";s:4:"18b7";s:43:"Resources/Private/Language/locallang_db.xlf";s:4:"e1f1";s:54:"Resources/Private/Templates/Googleanalytics/Track.html";s:4:"5e0f";s:41:"Resources/Public/Js/tw_googleanalytics.js";s:4:"c949";s:45:"Resources/Public/Js/tw_googleanalytics.min.js";s:4:"a639";s:51:"Resources/Public/Js/tw_googleanalytics_universal.js";s:4:"e4de";s:55:"Resources/Public/Js/tw_googleanalytics_universal.min.js";s:4:"2739";s:14:"doc/manual.pdf";s:4:"8dbe";s:14:"doc/manual.sxw";s:4:"cbb2";}',
);

?>