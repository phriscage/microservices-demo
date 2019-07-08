/*
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Firebase and FirebaseUI methods for Hipster App demo context.
 */


/**
 * Displays the UI for a signed in user.
 * @param {!firebase.User} user
 */
var handleSignedInUser = function(user) {
		if (document.getElementById('user-signed-in')) {
			document.getElementById('user-signed-in').className = 'd-block';
			document.getElementById('name').value = 'Hi ' + user.displayName + '!';
			document.getElementById('email').value = user.email;
			user.getIdTokenResult().then(function(idTokenResult) {
				var jwtIoUrl = "'https://jwt.io/?value=" + idTokenResult.token + "'";
				var idTokenLabel = 'ID Token: | <a target="_blank" href=' + jwtIoUrl + '>jwt.io</a>';
				// let's set the idToken as a cookie for demo
				setCookie('firebase_id-token', idTokenResult.token, idTokenResult.expirationTime);
				document.getElementById('id-token').value = idTokenResult.token;
				document.getElementById('id-token-label').innerHTML = idTokenLabel;
			});
		};
		if (document.getElementById('user-signed-out') != null) {
			document.getElementById('user-signed-out').className = 'd-none';
		};
		if (document.getElementById('user-signed-in-menu') != null) {
			document.getElementById('user-signed-in-menu').className = 'd-block';
			// document.getElementById('user-profile-menu').innerHTML = '<a href="/login">' + user.email + '</a>';
			document.getElementById('user-signed-in-menu-image').src = user.photoURL;
			var displayNameEmail = user.displayName + '<pre>' + user.email + '</pre>';
			document.getElementById('user-signed-in-menu-name').innerHTML = displayNameEmail;
		};
		if (document.getElementById('user-signed-out-menu') != null) {
			document.getElementById('user-signed-out-menu').className = 'd-none';
		};
};

/**
 * Displays the UI for a signed out user.
 */
var handleSignedOutUser = function() {
		eraseCookie('firebase_id-token');
		if (document.getElementById('user-signed-in')) {
			document.getElementById('user-signed-in').className = 'd-none';
		};
		if (document.getElementById('user-signed-out') != null) {
			document.getElementById('user-signed-out').className = 'd-block';
		};
		if (document.getElementById('user-signed-in-menu') != null) {
			document.getElementById('user-signed-in-menu').className = 'd-none';
		};
		if (document.getElementById('user-signed-out-menu') != null) {
			document.getElementById('user-signed-out-menu').className = 'd-block';
		};
};

/**
 * handle the log-out for a user.
 */
document.getElementById('sign-out').addEventListener('click', function() {
		console.log('signOut');
		firebase.auth().signOut();
		window.location.replace('/login');
});

/**
 * handle the user profile menu button click
 */
// document.getElementById('user-signed-in-menu-image').addEventListener('click', function() {
		// window.location.replace('/login');
// });

document.addEventListener('DOMContentLoaded', function() {
		try {
				firebase.auth().onAuthStateChanged(function(user) {
						user ? handleSignedInUser(user) : handleSignedOutUser();
				});
		} catch (e) {
				// console.error('firebase.auth().onAuthStateChanged: ', e);
				handleSignedOutUser();
				var message = ' Firebase Auth ' + e + ' Try updating the <a href="/config">configuration</a>';
				var content = `
						<div class="alert alert-warning alert-dismissible fade show" role="alert">
								<strong>Warning!</strong> ` + message + `
								<button type="button" class="close" data-dismiss="alert" aria-label="Close">
								<span aria-hidden="true">&times;</span>
								</button>
						</div>
				`;
				if (document.getElementById('firebaseui-auth-container')) {
					document.getElementById('firebaseui-auth-container').innerHTML = content;
				};
		};
		try {
				let app = firebase.app();
				let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
		} catch (e) {
				console.error(e);
				if (document.getElementById('firebaseui-auth-container')) {
					document.getElementById('firebaseui-auth-container').innerHTML = 'Error loading the Identity Platform SDK, check the console.';
				};
		};
});

/**
 * Utils
 */

/**
 * Set Cookie
 * @param {name, value, days}
 */
function setCookie(name,value,expiresTime) {
    var expires = "; expires=" + expiresTime;
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

/**
 * Get Cookie
 * @param {name}
 */
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

/**
 * erase Cookie
 * @param {name}
 */
function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}
