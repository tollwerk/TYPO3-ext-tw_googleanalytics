<?php

########################################################################
# Extension Manager/Repository config file for ext "tw_googleanalytics".
#
# Auto generated 21-12-2013 18:43
#
# Manual updates:
# Only the data in the array - everything else is removed by next
# writing. "version" and "dependencies" must not be touched!
########################################################################

$EM_CONF[$_EXTKEY] = array(
	'title' => 'tollwerk Google Analytics',
	'description' => '[TYPO3 CMS 6 Release] Frontend plugin for advanced Google Analytics integration with a wide range of features including pageView and event tracking, custom variables, cross domain tracking, tracking of file downloads and external domains and much more. The extension is built on extbase / fluid and supports the asynchronous tracking code only (ga.js). ATTENTION: Support for TYPO3 4.x has been dropped, use the 1.x versions instead!',
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
	'version' => '2.5.2',
	'constraints' => array(
		'depends' => array(
			'extbase' => '6.0.0-0.0.0',
			'fluid' => '6.0.0-0.0.0',
			'php' => '5.3.0-0.0.0',
			'typo3' => '6.0.0-6.1.99',
		),
		'conflicts' => array(
		),
		'suggests' => array(
		),
	),
	'_md5_values_when_last_written' => 'a:71:{s:10:".buildpath";s:4:"5b39";s:10:".gitignore";s:4:"30a1";s:8:".project";s:4:"9d86";s:12:"ext_icon.gif";s:4:"fb0a";s:17:"ext_localconf.php";s:4:"cd7a";s:14:"ext_tables.php";s:4:"70e8";s:14:"ext_tables.sql";s:4:"194c";s:11:"LICENSE.txt";s:4:"e8c1";s:9:"README.md";s:4:"6c10";s:11:".git/config";s:4:"1e9f";s:15:".git/FETCH_HEAD";s:4:"2ece";s:9:".git/HEAD";s:4:"4cf2";s:10:".git/index";s:4:"d8ef";s:14:".git/logs/HEAD";s:4:"4b23";s:27:".git/logs/refs/heads/master";s:4:"4b23";s:36:".git/logs/refs/remotes/origin/master";s:4:"65b1";s:54:".git/objects/01/2753453283f10645ec93b033256b84a0e2f570";s:4:"9bac";s:54:".git/objects/05/83e94bc01f6f7a96818e46a2b2794753884381";s:4:"460a";s:54:".git/objects/18/5491f04f1d871ac49899a336b0c677a718004f";s:4:"45fc";s:54:".git/objects/19/a69e5184ead3884924b550ad48781c72b4970f";s:4:"476c";s:54:".git/objects/26/da83a25a7aafe393b0631cfc08a124f07a10c7";s:4:"9012";s:54:".git/objects/2c/6e4d8b9401440da6f79687310a1fc506b96edd";s:4:"84ff";s:54:".git/objects/2e/261d89468c0c0ed48a7b88f45bb6546831e6d4";s:4:"0429";s:54:".git/objects/32/1c838a0210e75b854c1b20cb7181b90bddb634";s:4:"8571";s:54:".git/objects/42/65fde58ba792e2958ab5b776b37e8eee87ec15";s:4:"7def";s:54:".git/objects/44/7ecdd680d32e39a35c469ace2bb3f941144614";s:4:"2b23";s:54:".git/objects/4d/e270fc5b2141b8b7aa6a73201465f88992d4a8";s:4:"79f9";s:54:".git/objects/5b/1f5c4be4d8123c6f6fa0f77cd32190ba03adbb";s:4:"1a77";s:54:".git/objects/60/273c5a4a36a6f1f63b19c52f355b2e90aba89e";s:4:"5ec8";s:54:".git/objects/65/ce3fd4f789be07710f73f5cccca7ece5f09edc";s:4:"df4b";s:54:".git/objects/78/a7639813963098cdf4816c245ddfeca3268aed";s:4:"a98b";s:54:".git/objects/7b/1f48b927074c4f7d16bbeedc0d75a7a9f7c9d8";s:4:"6b61";s:54:".git/objects/7d/d81ea89d4c68f7f9daa8a72fac26652121baca";s:4:"6435";s:54:".git/objects/88/810fefa9db0c217700b418df3cdf57a51af5fe";s:4:"d97a";s:54:".git/objects/8f/e1c4e3748f1dc8d47e77fbd2c58ef47d713952";s:4:"6104";s:54:".git/objects/92/c252668f9f875810ce5f72a687dddbb68d6a15";s:4:"2cfc";s:54:".git/objects/9c/89d739d0170f86a04fae363ce5cff303a2dd27";s:4:"6a85";s:54:".git/objects/a7/1366330900d0a466321d84a06d07b539529c36";s:4:"13f4";s:54:".git/objects/ae/fa5e4a4569f9107e86c554cd5d7b7aa306ef1b";s:4:"baca";s:54:".git/objects/b1/08c3329d441dbf71761ed7942393fe2cf1aa6c";s:4:"f57b";s:54:".git/objects/b1/69928ab7a0b6988696478c53a5fe03201b2cae";s:4:"1fd9";s:54:".git/objects/be/e37001e6122571e32831431f3b9236b77267ad";s:4:"f3b2";s:54:".git/objects/c8/519674484845ae1d087ee6ba823ae7b9bfa96b";s:4:"d518";s:54:".git/objects/d2/f94efa60c4b6866c72b5454dc5cee3feb52ae4";s:4:"89d1";s:54:".git/objects/e1/3d7693a1b445390324a65fd96fb401c12dead1";s:4:"f802";s:54:".git/objects/e2/be0023f9cb0ba9c5aebea2e400f74161ce10b4";s:4:"8292";s:54:".git/objects/e4/155eae36a387d5e415826a76507feec4c280e3";s:4:"b577";s:54:".git/objects/e8/33210b3e773581e921a152f1f9ab8ebf6cac32";s:4:"42d7";s:54:".git/objects/e9/010c90ae6a6242a45bdfd6fd7de7beed8c6fb2";s:4:"5180";s:54:".git/objects/eb/c61e1c0edff892f58b2fcb2fb6be6b043601b1";s:4:"2235";s:54:".git/objects/f0/f04cd9b4bde7d5f0f598dd78f53146532577de";s:4:"ad75";s:54:".git/objects/f3/7d41446f7488a4e2404f85707d4f6c88b5f4ca";s:4:"4e4f";s:54:".git/objects/f5/9934b678dfaa51a49d5109462fabf212d82733";s:4:"d8e1";s:54:".git/objects/f7/9dd9ded26b512d741d9e7cb70683c1838443b8";s:4:"3655";s:67:".git/objects/pack/pack-a722c21635473e6d498683e61c0f2534424d2440.idx";s:4:"9f64";s:68:".git/objects/pack/pack-a722c21635473e6d498683e61c0f2534424d2440.pack";s:4:"550f";s:22:".git/refs/heads/master";s:4:"c79d";s:31:".git/refs/remotes/origin/master";s:4:"c79d";s:36:".settings/org.eclipse.php.core.prefs";s:4:"76a4";s:48:"Classes/Controller/GoogleanalyticsController.php";s:4:"68c7";s:38:"Configuration/TypoScript/constants.txt";s:4:"6b8b";s:34:"Configuration/TypoScript/setup.txt";s:4:"f367";s:46:"Resources/Private/Language/de.locallang_db.xlf";s:4:"45a2";s:46:"Resources/Private/Language/fr.locallang_db.xlf";s:4:"dc49";s:40:"Resources/Private/Language/locallang.xlf";s:4:"18b7";s:43:"Resources/Private/Language/locallang_db.xlf";s:4:"e1f1";s:54:"Resources/Private/Templates/Googleanalytics/Track.html";s:4:"5e0f";s:41:"Resources/Public/Js/tw_googleanalytics.js";s:4:"c949";s:51:"Resources/Public/Js/tw_googleanalytics_universal.js";s:4:"e4de";s:14:"doc/manual.pdf";s:4:"c2fd";s:14:"doc/manual.sxw";s:4:"d2fb";}',
);

?>