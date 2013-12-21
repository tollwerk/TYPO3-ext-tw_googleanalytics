<?php

/***************************************************************
 *  Copyright notice
 *
 *  Copyright © 2013 Dipl.-Ing. Joschi Kuphal (joschi@tollwerk.de)
 *  All rights reserved
 *
 *  This script is part of the TYPO3 project. The TYPO3 project is
 *  free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  The GNU General Public License can be found at
 *  http://www.gnu.org/copyleft/gpl.html.
 *  A copy is found in the textfile GPL.txt and important notices to the license
 *  from the author is found in LICENSE.txt distributed with these scripts.
 *
 *
 *  This script is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  This copyright notice MUST APPEAR in all copies of the script!
 ***************************************************************/

if (!defined('TYPO3_MODE')) {
	die ('Access denied.');
}

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile($_EXTKEY, 'Configuration/TypoScript', 'tollwerk Google Analytics');

\TYPO3\CMS\Core\Utility\GeneralUtility::loadTCA('pages');
$TCA['pages']['columns']['tx_twgoogleanalytics_no_tracking'] = array(
	'label'			=> 'LLL:EXT:tw_googleanalytics/Resources/Private/Language/locallang_db.xlf:pages.tx_twgoogleanalytics_no_tracking',
	'config'		=> Array (
		'type'		=> 'check',
		'items'		=> array(
			array('LLL:EXT:cms/locallang_tca.xml:pages.no_search_checkbox_1_formlabel', 1),
		)
	)
);

$GLOBALS['TCA']['pages']['palettes']['miscellaneous']['showitem'] .= ',tx_twgoogleanalytics_no_tracking';

?>