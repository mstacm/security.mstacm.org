<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ACM SIG-Security | Cyber Defense Team</title>
		<a href="index.html" class="w3-center w3-padding w3-margin"><img src="header-logo-wide.png" style="width:90%;height:20%;padding:15px;"></a>

		<!-- Link Stylesheet -->
		<link rel="stylesheet" href="https://acmsigsec.mst.edu/w3schools.css">
		<link rel="stylesheet" type="text/css" href="styles.css">

		<div id="nav">
			<ul>
				<li><a href="cdt.php" class="menu">Cyber Defense Team</a></li>
				<li><a href="talks.html" class="menu">Events</a></li>
				<li><a href="learn.html" class="menu">Learn Security</a></li>
			    <!--<li><a href="cyberspark.html" class="menu">CyberSpark</a></li> -->
				<li><a href="education.html" class="menu">S&T Education</a></li>
				<li><a href="https://acm.mst.edu/" class="menu">ACM General</a></li>
				<li><a href="archives.html" class="menu">Archives</a></li>
				<li><a href="join.html" class="menu">Join SIG-Sec</a></li>
				<li><a href="contact.html" class="menu">Officers</a></li>
			</ul>
		</div>
</head>

<body>

<!-- CDT Stats -->
<table class="w3-twothird w3-table w3-large w3-border w3-bordered" style="margin:16px 0 0 40px; height:222px">
	<tr class="w3-gray">
		<td class="w3-light-grey w3-text-light-green w3-wide"><strong>M57 2017 Capture the Flag Stats</strong></td>
		<td class="w3-light-grey"></td>
	</tr>
	<tr>
		<td>Global Ranking</td>
  <?php
      $json = file_get_contents('https://ctftime.org/api/v1/teams/15342/');
      $obj = json_decode($json, TRUE);
      echo "<td>";
      echo $obj['rating'][0]['2017']['rating_place'];
      ?>
	</tr>
	<tr>
		<td>Rating Points</td>
  <?php
      echo "<td>";
      echo (int)$obj['rating'][0]['2017']['rating_points'];
      echo "</td>";
   ?>
	</tr>
	<tr>
		<td>Academic US Ranking</td>
		<td>20</td>
	</tr>
</table>

<!-- CTF Member Login -->
<div class="w3-border w3-card w3-quarter w3-margin">
	<header class="w3-container w3-light-grey">
		<h4 class="w3-text-light-green"><strong>CTF Member Login</strong></h4>
	</header><br/>
	<form class="w3-container">
		<input class="w3-input w3-border w3-light-grey" type="text" placeholder="Username">
		<input class="w3-input w3-border w3-light-grey" type="password" placeholder="Password">
		<br/>
		<a href="index.html" class="w3-btn-block w3-dark-grey" style="margin-bottom:10px">Login</a>
	</form>
</div>

<!-- Upcoming Events and Talks -->
<div class="w3-padding w3-container w3-twothird" style="margin:20px 0 0 40px;">
	<div class="w3-center w3-xxlarge w3-text-dark-grey"><strong>What is CDT?</strong></div>
	<div class="w3-center w3-xlarge w3-text-dark-grey w3-wide">Team Captain Contact Info</div>
</div>

<!-- Join CDT -->
<div class="w3-padding w3-container w3-twothird" style="margin:20px 0 0 40px;">
	<div class="w3-center w3-xxlarge w3-text-dark-grey"><strong>Want to join CDT?</strong></div>
	<div class="w3-center w3-xlarge w3-text-dark-grey w3-wide">Team Captain Contact Info</div>
	<table style="width:100%">
		<tr class="w3-left-align w3-xlarge">
			<td class="w3-text-dark-gray w3-xxlarge">CTF Captain</td>
			<td class="w3-text-dark-gray w3-xxlarge w3-right">CCDC Captain</td>
		</tr>
		<tr class="w3-left-align w3-xlarge">
			<td class="w3-text-dark-gray"><a href="mailto:esmxv3@mst.edu">Brendan Curran</a></td>
			<td class="w3-text-dark-gray w3-right"><a href="mailto:slbmnc@mst.edu">Adam Eaton and Sammie Bush</a></td>
		</tr>
	</table>
</div>

<!-- CCDC Member Login -->
<div class="w3-card w3-quarter w3-margin">
	<header class="w3-container w3-light-grey">
		<h4 class="w3-text-light-green"><strong>CCDC Member Login</strong></h4>
	</header><br/>
	<form class="w3-container">
		<input class="w3-input w3-border w3-light-grey" type="text" placeholder="Username">
		<input class="w3-input w3-border w3-light-grey" type="password" placeholder="Password">
		<br/>
		<a href="index.html" class="w3-btn-block w3-dark-grey"style="margin-bottom:10px">Login</a>
	</form>
</div>

<!-- CDT Abstract -->
<div class="w3-twothird w3-center" style="margin:16px 0 0 40px;">
  <p> The mission of Missouri University of Science and Technology's Capture The Flag team, M57, is to provide hands-on experience and help team members develop attack-oriented cybersecurity skills by competing in online CTF competitions. Members of M57 learn relevant security tools and methods of attacking vulnerable systems presented during CTF’s. M57 strives to be a prominent force in the CTF community by excelling in competitions, providing well written documentation, and developing resources to other team members. </p>
</div>

<!-- Members -->
<div class="w3-container w3-twothird w3-margin w3-padding w3-center">
	<!-- Members -->
    <div class="w3-container w3-twothird w3-margin w3-padding w3-center">
    	<div class="w3-wide w3-padding w3-xlarge">Fall 2017 CDT Members</div>
    	<div class="w3-third w3-large">
    	    Aaron Joyce<br/>
    		Adam Eaton<br/>
            Adam Evans<br/>
            Adam Gausmann<br/>
            Alec Belue<br/>
            Alex Hatfalvi<br/>
            Allison Chan<br/>
            Andrew Sunarto<br/>
            Brendan Curran<br/>
            Brenden Barlow<br/>
            Caleb Berg<br/>
            Carson Vance<br/>
            Cody Less<br/>
            Cody Roberts<br/>
            Conor Kohls<br/>
            Cooper Healy<br/>
            Dalton R. Cole<br/>
            Tanner Winkelman<br/>
            Tevin Niang-Trost<br/>
            Trevan Lang<br/>
            Tanner Stephens<br/>
    	</div>
    	<div class="w3-third w3-large">

    		Brenden Barlow<br/>
            Caleb Berg<br/>
            Carson Vance<br/>
            Cody Less<br/>
            Cody Roberts<br/>
            Conor Kohls<br/>
            Cooper Healy<br/>
            Dalton R. Cole<br/>
            Daniel Post<br/>
            David Wood<br/>
            Eric Michalak<br/>
            Gavin Lewis<br/>
            Hannah Reinbolt<br/>
            Henry Wong<br/>
            Jeff Gould<br/>
            Joey Klix<br/>
             Michael Becker<br/>
             Nathan LaRose<br/>
             Patrick Dillon<br/>
             SammyBRaps<br/>
             Sara Newman<br/>
    	</div>
    	<div class="w3-third w3-large">
    		Jonathan Miller<br/>
            Jose Alega<br/>
            Joseph Kipp<br/>
            Josh Cash<br/>
            Josh Herman<br/>
            Joshua Pondrom<br/>
            Kat Ward<br/>
            Kevin Newell<br/>
            Kevin Schoonover<br/>
            Kristin Walker<br/>
            Lucas Hinkebein<br/>
            Lucas Winkelman<br/>
            Luis Ocampo<br/>
            Luke Smith<br/>
            Mark Myers<br/>
            Matthew Stroble<br/>
            Savannah Collins<br/>
            Shelby Hayes<br/>
            Shwam McCormick<br/>
            Steve Giangreco<br/>
    	</div>
    </div>


</body>
</html>
