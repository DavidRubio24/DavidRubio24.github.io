// Function to retrieve the value of a URL parameter
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Function to find the closest keyword using Levenshtein Distance
function findClosestKeyword(keyword) {
  var closestKeyword = "";
  var shortestDistance = Infinity;
  
  for (var key in keywordUrls) {
    if (keywordUrls.hasOwnProperty(key)) {
      var distance = calculateDistance(keyword, key);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        closestKeyword = key;
      }
    }
  }
  return closestKeyword;
}

// Distance calculation algorithm
function calculateDistance(str1, str2) {
  var m = str1.length;
  var n = str2.length;
  var dp = new Array(m + 1);
  
  for (var i = 0; i <= m; i++) {
    dp[i] = new Array(n + 1);
    dp[i][0] = i;
  }
  for (var j = 0; j <= n; j++) {
    dp[0][j] = j;
  }
  for (var i = 1; i <= m; i++) {
    for (var j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1, // substitution
          dp[i][j - 1] + 1,     // insertion
          dp[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return dp[m][n];
}

// Core execution orchestration
function executeRouting() {
  var destinationValue = getParameterByName('to');
  if (!destinationValue) {
    document.getElementById('invalid-keyword').textContent = "No redirection target provided via '?to=' parameter.";
    return;
  }

  // Fallback if the requested dictionary didn't populate the keywordUrls object
  if (typeof keywordUrls === 'undefined') {
    document.getElementById('invalid-keyword').textContent = "Error: Redirect dictionary failed to load properly.";
    return;
  }

  var invalidKeywordElement = document.getElementById('invalid-keyword');

  // Strict match execution
  if (keywordUrls.hasOwnProperty(destinationValue)) {
    if (destinationValue[0] === '.') {
      // Intentional joke lag sequence
      setTimeout(function() {
        window.location.href = keywordUrls[destinationValue];
      }, 10000);

      var link = document.createElement('a');
      link.href = keywordUrls[destinationValue];
      link.textContent = 'Installing virus. Close tab to cancel (Ctrl + F4).';
      link.setAttribute('autofocus', 'autofocus');
      invalidKeywordElement.innerHTML = '';
      invalidKeywordElement.appendChild(link);
      link.focus();
    } else {
      window.location.href = keywordUrls[destinationValue];
      invalidKeywordElement.textContent = keywordUrls[destinationValue];
    }
  } else {
    // Closest match fallback calculations
    var closestKeyword = findClosestKeyword(destinationValue);
    
    invalidKeywordElement.innerHTML = 'Invalid keyword: ' + destinationValue +
      '<br><br><a href="' + keywordUrls[closestKeyword] + '" style="color: #FFFFFF; text-decoration: none;">Did you mean <a href="' + keywordUrls[closestKeyword] + '" id="closest-keyword-link">' +
      closestKeyword + '</a>?</a><br><br><br><a href="https://www.google.com/search?q=' + destinationValue + '" style="color: #FFFFFF; text-decoration: none;">Or search </a><a id="google-search-link" href="https://www.google.com/search?q=' + destinationValue + '" >' + destinationValue + '</a><a href="https://www.google.com/search?q=' + destinationValue + '" style="color: #FFFFFF; text-decoration: none;"> in Google.</a>';

    if (calculateDistance(closestKeyword, destinationValue) < 3) {
      document.getElementById('closest-keyword-link').focus();
    } else {
      document.getElementById('google-search-link').focus();
    }
  }
}

// Runtime Setup initialization
window.addEventListener('DOMContentLoaded', function() {
  var dictUrl = getParameterByName('dict');
  
  if (dictUrl) {
    // Dynamically inject the script tag pointed to by the parameter
    var script = document.createElement('script');
    script.src = dictUrl;
    script.onload = function() {
      executeRouting();
    };
    script.onerror = function() {
      document.getElementById('invalid-keyword').textContent = "Failed to load the specified dictionary file: " + dictUrl;
    };
    document.head.appendChild(script);
  } else {
    document.getElementById('invalid-keyword').textContent = "Missing config parameter '?dict=' pointing to your script.";
  }
});