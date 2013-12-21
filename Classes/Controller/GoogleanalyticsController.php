<?php

namespace Tollwerk\TwGoogleanalytics\Controller;

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

/**
 * Google Analytics Tracker Controller
 *
 * @package		tw_googleanalytics
 * @copyright	Copyright © 2013 tollwerk® GmbH (http://tollwerk.de)
 * @author		Dipl.-Ing. Joschi Kuphal <joschi@tollwerk.de>
 */
class GoogleanalyticsController extends \TYPO3\CMS\Extbase\Mvc\Controller\ActionController {
	/**
	 * Minimum custom variable index
	 * 
	 * @var int
	 */
	protected $_minIndex = 1;
	/**
	 * Maximum custom variable index
	 *
	 * @var int
	 */
	protected $_maxIndex = 5;
	/**
	 * Levels / scopes
	 * 
	 * @var array
	 */
	protected static $_levels = array(
		'visitor'		=> self::LEVEL_VISITOR,
		'session'		=> self::LEVEL_SESSION,
		'page'			=> self::LEVEL_PAGE,
	);
	/**
	 * Visitor Level
	 *
	 * @var int
	 */
	const LEVEL_VISITOR = 1;
	/**
	 * Session Level
	 *
	 * @var int
	 */
	const LEVEL_SESSION = 2;
	/**
	 * Page Level
	 * 
	 * @var int
	 */
	const LEVEL_PAGE = 3;
	/**
	 * No domain name
	 * 
	 * @var string
	 */
	const DOMAIN_NONE = 'none';
	/**
	 * Automatic domain name resolution
	 * 
	 * @var string
	 */
	const DOMAIN_AUTO = 'auto';
	
	/************************************************************************************************
	 * PUBLIC METHODS
	***********************************************************************************************/
	
	/**
	 * Inclusion of the tracking code
	 * 
	 * @return void
	 */
	public function trackAction() {
		$this->settings['features']['anonymizeIP']			= intval((boolean)$this->settings['features']['anonymizeIP']);
		foreach ($this->settings['features']['track'] as $feature => $enabled) {
			$this->settings['features']['track'][$feature]	= intval((boolean)$enabled);
		}
		
		// Crossdomain tracking
		$this->settings['crossdomain']['sub']				= intval($this->settings['crossdomain']['sub']);
		switch ($this->settings['crossdomain']['sub']) {
			case 0:
				$this->settings['crossdomain']['main']		= self::DOMAIN_NONE;
				break;
			case 1:
				$this->settings['crossdomain']['main']		= self::DOMAIN_AUTO;
				break;
			default:
				$mainDomain									= $this->_getDomains($this->settings['crossdomain']['main']);
				$this->settings['crossdomain']['main']		= count($mainDomain) ? array_shift($mainDomain) : self::DOMAIN_AUTO;
				break;
		}
		$this->settings['crossdomain']['cross']				= $this->_getDomains($this->settings['crossdomain']['cross']);
		
		// Collecting custom variables (Google Analytics only)
		$customVariables				= array();
		foreach((array_key_exists('customVariables', $this->settings) ? (array)$this->settings['customVariables'] : array()) as $index => $variableKeyValue) {
			$index						= intval($index);
			if (($index >= $this->_minIndex) && ($index <= $this->_maxIndex) && is_array($variableKeyValue)) {
				$customVariable			= array('index' => $index, 'name' => null, 'value' => null, 'level' => null);
				foreach ($variableKeyValue as $key => $value) {
					$value				= is_array($value) ? $this->_getValue($value) : trim($value);
					if (strlen($value)) {
						$key								= strtolower($key);
						if (($key == 'name') || ($key == 'value')) {
							$customVariable[$key]			= $value;
						} elseif (($key == 'level') && array_key_exists($value, self::$_levels)) {
							$customVariable['level']		= self::$_levels[$value];
						}
					}
				}
				if (($customVariable['name'] !== null) && ($customVariable['value'] !== null) && ($customVariable['level'] !== null)) {
					$customVariable['value']				= substr($customVariable['value'], 0, 63 - strlen($customVariable['name']));
					$customVariables[]						= array_values($customVariable);
				}
			} 
		}
		
		// Collecting custom dimension & metrics (Universal Analytics only)
		$customDimensions									=
		$customMetrics										= array();
		foreach((array_key_exists('customDimensions', $this->settings) ? (array)$this->settings['customDimensions'] : array()) as $dimension => $value) {
			if (preg_match("%^dimension\d+$%", $dimension)) {
				$customDimensions[$dimension]				= is_array($value) ? $this->_getValue($value) : strval($value);
			}
		}
		foreach((array_key_exists('customMetrics', $this->settings) ? (array)$this->settings['customMetrics'] : array()) as $metric => $value) {
			if (preg_match("%^metric\d+$%", $metric)) {
				$value										= is_array($value) ? $this->_getValue($value) : strval($value);
				if (preg_match("%^\d+(\.\d+)?$%", $value)) {
					$customMetrics[$metric]					= floatval($value);
				}
			}
		}
		
		$this->settings['external']['track']				= min(2, max(0, intval($this->settings['external']['track'])));
		$this->settings['external']['prefix']				= $this->settings['external']['track'] ? trim($this->settings['external']['prefix']) : '';
		$this->settings['external']['track']				= strlen($this->settings['external']['prefix']) ? $this->settings['external']['track'] : 0;
		$this->settings['external']['restrict']				= json_encode($this->settings['external']['track'] ? $this->_getDomains($this->settings['external']['restrict']) : array());
		
		$this->settings['email']['track']					= min(2, max(0, intval($this->settings['email']['track'])));
		$this->settings['email']['prefix']					= $this->settings['email']['track'] ? trim($this->settings['email']['prefix']) : '';
		$this->settings['email']['track']					= strlen($this->settings['email']['prefix']) ? $this->settings['email']['track'] : 0;
		if ($this->settings['email']['track']) {
			$restrictEmails									= array_map('trim', preg_split("%[\,\;\s\|]+%", trim($this->settings['email']['restrict'])));
			$this->settings['email']['restrict']			= array();
			foreach ($restrictEmails as $restrictEmail) {
				if (strlen($restrictEmail)) {
					$this->settings['email']['restrict'][]	= $restrictEmail;
				}
			}
			$this->settings['email']['restrict']			= json_encode($this->settings['email']['restrict']);
		} else {
			$this->settings['email']['restrict']			= array();
		}

		$this->settings['download']['track']				= min(2, max(0, intval($this->settings['download']['track'])));
		$this->settings['download']['prefix']				= $this->settings['download']['track'] ? trim($this->settings['download']['prefix']) : '';
		$this->settings['download']['template']				= $this->settings['download']['template'] ? trim($this->settings['download']['template']) : '{pathname}';
		$downloadFoldersExtensions							= strlen(trim($this->settings['download']['list'])) ? explode(',', $this->settings['download']['list']) : array();
		$this->settings['download']['list']					= array();
		foreach ($downloadFoldersExtensions as $downloadFoldersExtensionsConfig) {
			$downloadFoldersExtensionsConfig				= strlen(trim($downloadFoldersExtensionsConfig)) ? array_map('trim', explode('=', $downloadFoldersExtensionsConfig)) : array();
			if ((count($downloadFoldersExtensionsConfig) == 2) && strlen($downloadFoldersExtensionsConfig[0]) && strlen($downloadFoldersExtensionsConfig[1])) {
				$this->settings['download']['list'][$downloadFoldersExtensionsConfig[0]] = preg_split("%\s+%", $downloadFoldersExtensionsConfig[1]);
			}
		}
		$this->settings['download']['track']				= (strlen($this->settings['download']['prefix']) && count($this->settings['download']['list'])) ? $this->settings['download']['track'] : 0;
		$this->settings['download']['list']					= json_encode($this->settings['download']['list']);
		
		$this->settings['direct']['keywords']				= json_encode(\TYPO3\CMS\Core\Utility\GeneralUtility::trimExplode(',', implode(',', preg_split("%[\,\;]+%", $this->settings['direct']['keywords'])), true));
		$this->settings['direct']['referrers']				= json_encode(\TYPO3\CMS\Core\Utility\GeneralUtility::trimExplode(',', implode(',', preg_split("%[\,\;]+%", $this->settings['direct']['referrers'])), true));
		
		$searchEngines										= preg_split("%[\,\;]+%", $this->settings['searchengines']);
		$this->settings['searchengines']					= array();
		foreach ($searchEngines as $searchEngine) {
			if (strlen(trim($searchEngine)) && preg_match("%^([^\=]+)\040*\=([^\!]+)(\!?)$%", trim($searchEngine), $searchEngineDefinition)) {
				$this->settings['searchengines'][]			= array(trim($searchEngineDefinition[1]), trim($searchEngineDefinition[2]), !!$searchEngineDefinition[3]);
			}
		}
		$this->settings['searchengines']					= json_encode($this->settings['searchengines']);
		
		$this->view->assign('customVariables', json_encode($customVariables));
		$this->view->assign('customDimensionsMetrics', json_encode(array_merge($customDimensions, $customMetrics)));
		$this->view->assign('pageUrl', $this->_getPageUrl(array_key_exists('pageUrl', $this->settings) ? $this->settings['pageUrl'] : null));
		$this->view->assign('settings', $this->settings);
	}
	
	/************************************************************************************************
	 * PRIVATE METHODS
	 ***********************************************************************************************/
	
	/**
	 * Extracting the current page title
	 * 
	 * @param string|array $pageUrlConfig			Page URL configuration
	 * @return string								Page URL
	 */
	protected function _getPageUrl($pageUrlConfig) {
		
		// If a configuration array has been passed ...
		if (is_array($pageUrlConfig)) {
			$typoScriptService			= new \TYPO3\CMS\Extbase\Service\TypoScriptService();
			$pageUrlConfig				= $typoScriptService->convertTypoScriptArrayToPlainArray($this->settings);
			/* @var $cObj \TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer */			
			$cObj						= $GLOBALS['TSFE']->cObj;
			$pageUrl					= $cObj->cObjGetSingle($pageUrlConfig['pageUrl'], $pageUrlConfig['pageUrl.']);
			return $pageUrl;
			
		// ... else if a literal page title has been passed ... 
		} elseif (strlen($pageUrlConfig = trim($pageUrlConfig))) {
			return $pageUrlConfig;
			
		// ... else return current request URL
		} else {
			return $_SERVER['REQUEST_URI'];
		}
	}
	
	/**
	 * Extraction of complex values
	 * 
	 * @param array $valueConfig		Value configuration
	 * @return string					Value
	 */
	protected function _getValue(array $valueConfig) {
		$returnValue					= null;
		
		if (array_key_exists('_typoScriptNodeValue', $valueConfig)) {
			$valueType					= strtolower($valueConfig['_typoScriptNodeValue']);
			unset($valueConfig['_typoScriptNodeValue']);
			
			switch ($valueType) {
				
				// Value extraction based on a GET / POST variable
				case 'gp':
					
					// Detect if a database lookup is required
					if (array_key_exists('lookup', $valueConfig)) {
						$lookup			= trim($valueConfig['lookup']);
						unset($valueConfig['lookup']);
					} else {
						$lookup			= null;
					}
					
					// Extraction of the requested GET / POST variable
					$gpVariables		= array();
					$gpValues			= array();
					foreach ($valueConfig as $key => $value) {
						if (strval(intval($key)) == strval($key)) {
							list($value, $default)			= array_pad(explode('|', $value, 2), 2, null);
							$gpVariables[intval($key)]		= preg_split("%[\]\[]+%", trim($value, ']'));
							if ($default != null) {
								$gpValues[intval($key)]		= trim($default);
							}
						}
					}
					
					// If there exists a key 1 ...
					if (array_key_exists(1, $gpVariables)) {
						
						foreach ($gpVariables as $index => $steps) {
							$stack							= null;
							foreach ($steps as $step) {
								$stack						= ($stack == null) ? \TYPO3\CMS\Core\Utility\GeneralUtility::_GP($step) : (array_key_exists($step, $stack) ? $stack[$step] : null);
								if (!is_array($stack) && !strlen($stack)) {
									continue 2;
								}
							}
							if (is_scalar($stack)) {
								$gpValues[$index]			= $stack;
							}
						}
						
						// If all of the required values could be found ...
						if (count($gpValues) == count($gpVariables)) {
							
							// If a database lookup has been requested ...
							if (strlen($lookup)) {
								foreach ($gpValues as $key => $value) {
									$lookup					= str_replace('$'.$key, mysql_real_escape_string($value), $lookup);
								}
								
								$result						= $GLOBALS['TYPO3_DB']->sql_query($lookup);
								if ($result && $GLOBALS['TYPO3_DB']->sql_num_rows($result)) {
									$result					= $GLOBALS['TYPO3_DB']->sql_fetch_row($result);
									if (is_array($result) && count($result)) {
										$returnValue		= array_shift($result);
									}
								}
								
							// ... else return the first variabe value
							} else {
								$returnValue				= $gpValues[1];
							}
						}
					}
					break;
			}
		}
		
		return $returnValue;
	}
	
	/**
	 * Filter domain names out of a delimiter separated string (no domain name validation though) 
	 * 
	 * @param string $str				Domain name string
	 * @return array					Domain names
	 */
	protected function _getDomains($str) {
		$domains				= array();
		$str					= trim($str);
		if (strlen($str)) {
			$str				= array_map('trim', preg_split("%[^a-z\-\d\.]+%", strtolower($str)));
			foreach ($str as $domain) {
				if (strlen($domain)) {
					$domains[]	= $domain;
				}
			}
		}
		return $domains;
	}
}

?>