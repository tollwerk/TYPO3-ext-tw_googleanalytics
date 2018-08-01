<?php

########################################################################
# Extension Manager/Repository config file for ext "tw_googleanalytics".
#
# Auto generated 30-12-2016 19:13
#
# Manual updates:
# Only the data in the array - everything else is removed by next
# writing. "version" and "dependencies" must not be touched!
########################################################################

$EM_CONF[$_EXTKEY] = [
    'title'            => 'tollwerk Google Analytics',
    'description'      => 'Frontend plugin for advanced Google Analytics integration with a wide range of features including pageView and event tracking, custom variables / dimensions / metrics, cross domain tracking, tracking of file downloads and external domains and much more.',
    'category'         => 'plugin',
    'author'           => 'Joschi Kuphal',
    'author_email'     => 'joschi@tollwerk.de',
    'author_company'   => 'tollwerk® GmbH',
    'shy'              => '',
    'priority'         => '',
    'module'           => '',
    'state'            => 'stable',
    'internal'         => '',
    'uploadfolder'     => 0,
    'createDirs'       => '',
    'modify_tables'    => '',
    'clearCacheOnLoad' => 0,
    'lockType'         => '',
    'version'          => '4.0.0',
    'constraints'      => [
        'depends'   => [
            'extbase' => '8.7.7-',
            'fluid'   => '8.7.7-',
            'php'     => '7.0.0-0.0.0',
            'typo3'   => '8.7.7-',
        ],
        'conflicts' => [],
        'suggests'  => [],
    ],
];
