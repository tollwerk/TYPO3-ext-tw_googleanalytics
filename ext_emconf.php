<?php

########################################################################
# Extension Manager/Repository config file for ext "tw_googleanalytics".
#
# Auto generated 12-11-2013 18:41
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
	'version' => '2.5.1',
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
	'_md5_values_when_last_written' => 'a:50:{s:10:".buildpath";s:4:"8b02";s:8:".project";s:4:"1cfe";s:12:"ext_icon.gif";s:4:"fb0a";s:17:"ext_localconf.php";s:4:"cd7a";s:14:"ext_tables.php";s:4:"70e8";s:14:"ext_tables.sql";s:4:"194c";s:36:".settings/org.eclipse.php.core.prefs";s:4:"1f0a";s:12:".svn/entries";s:4:"2737";s:11:".svn/format";s:4:"2737";s:10:".svn/wc.db";s:4:"e3d2";s:66:".svn/pristine/17/17491a47ff76ad2bdef59174340af88123273652.svn-base";s:4:"309a";s:66:".svn/pristine/23/23f5a2b65b372b38e1e55cdfb266624653e1c453.svn-base";s:4:"f91c";s:66:".svn/pristine/24/247d050371717093233e3d6caa656b35868400ad.svn-base";s:4:"77be";s:66:".svn/pristine/26/260383a6f875eede138ce140cc21f5a7f7227345.svn-base";s:4:"3c5c";s:66:".svn/pristine/2b/2b6bab1f125d963a6d04b27226c01e7b174b07b6.svn-base";s:4:"32a9";s:66:".svn/pristine/2e/2e162f9f9d0957b8256db0acdb780d14e56de780.svn-base";s:4:"d9ec";s:66:".svn/pristine/3a/3a08f4a37054e5a1eeac494f5012bc2774c59743.svn-base";s:4:"6306";s:66:".svn/pristine/43/43c50b098218db13ab8a072f22b13ac8e6dac2c0.svn-base";s:4:"45a2";s:66:".svn/pristine/69/69f477d082f6cdc7ad090e9dc6bf66e8aee68bf2.svn-base";s:4:"2d5f";s:66:".svn/pristine/6d/6db2f2a1b9f8ffeb94624fabb98bfc6125fbb08d.svn-base";s:4:"e1f1";s:66:".svn/pristine/6e/6e7d156636f6a7dffa8ab6d2a611a3dc008ae545.svn-base";s:4:"f814";s:66:".svn/pristine/6f/6f6649ba5f218150dfe84ebbc3ff5229a41d0225.svn-base";s:4:"5e0f";s:66:".svn/pristine/75/75d57e6c417ab647b793782bac54ba0fae8a99cb.svn-base";s:4:"4c75";s:66:".svn/pristine/88/88c5aafab7cd7b375ba33f8e8c4f0cc81154e5bf.svn-base";s:4:"5aa2";s:66:".svn/pristine/90/904fa872a826d0b36b7493bf61b18ba34c945b7a.svn-base";s:4:"18b7";s:66:".svn/pristine/9e/9eba35cc32ae517bc267cd30fd9090e6743082dc.svn-base";s:4:"194c";s:66:".svn/pristine/9f/9f3af370442140cd69d7a81a04069637637930ed.svn-base";s:4:"065d";s:66:".svn/pristine/a6/a6c4b74e46b1cb97c18a4cea23608ee90737d1cb.svn-base";s:4:"ace3";s:66:".svn/pristine/a7/a7a708b6e36b14fd666ae78941d943c6fb2172dc.svn-base";s:4:"f367";s:66:".svn/pristine/aa/aa103374237969c7c3ed35d930c4fad4095b27c9.svn-base";s:4:"70e8";s:66:".svn/pristine/ac/acc566a062e7d691f83283202e4eff1307439aac.svn-base";s:4:"8e23";s:66:".svn/pristine/af/af0447b93d0c2dba6c860cb913a6f3bc2917b628.svn-base";s:4:"fb0a";s:66:".svn/pristine/b1/b1a3bf90e9bf962666b6afebc7848a52930a9ab3.svn-base";s:4:"add2";s:66:".svn/pristine/b5/b55dbcf6785364a65a0b3eced25a79191d6ab98d.svn-base";s:4:"cd7a";s:66:".svn/pristine/bf/bf8de0e69c388fb3675607c12a4e6e89f4880045.svn-base";s:4:"dc49";s:66:".svn/pristine/d5/d5d2a0b855f53d44c0813a4ffc49a93d9e3625ba.svn-base";s:4:"6b8b";s:66:".svn/pristine/ed/ed7e41da3209c8c09af6119607856dae014421b5.svn-base";s:4:"f966";s:66:".svn/pristine/f4/f445bc96f4287162808eb10719bae3c76a2af625.svn-base";s:4:"85a9";s:48:"Classes/Controller/GoogleanalyticsController.php";s:4:"309a";s:38:"Configuration/TypoScript/constants.txt";s:4:"6b8b";s:34:"Configuration/TypoScript/setup.txt";s:4:"f367";s:46:"Resources/Private/Language/de.locallang_db.xlf";s:4:"45a2";s:46:"Resources/Private/Language/fr.locallang_db.xlf";s:4:"dc49";s:40:"Resources/Private/Language/locallang.xlf";s:4:"18b7";s:43:"Resources/Private/Language/locallang_db.xlf";s:4:"e1f1";s:54:"Resources/Private/Templates/Googleanalytics/Track.html";s:4:"5e0f";s:41:"Resources/Public/Js/tw_googleanalytics.js";s:4:"c949";s:51:"Resources/Public/Js/tw_googleanalytics_universal.js";s:4:"e4de";s:14:"doc/manual.pdf";s:4:"868e";s:14:"doc/manual.sxw";s:4:"2454";}',
);

?>