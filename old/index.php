<?php

# REDIRECT TO TERMINAL FOR NOW

header("Location: terminal");

?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Will Brandon</title>
		<link type="text/css" rel="stylesheet" href="universal.css">
	</head>
	<body>

		<div class="header-box">
			<h1>Will Brandon</h1>
			<span>Full Stack Engineer</span>	
		</div>

		<button onclick="WindowManager.getWindow('terminal').show();">Launch Terminal</button>

		<div class="window" width="800" height="600" src="terminal" handle="terminal" title="Terminal" shown="false" position="centered-bottom"></div>

		<script src="windows/windows.js"></script>
        <script>
            WindowManager.getWindow("terminal").expBtnClicked();
        </script>
	</body>
</html>