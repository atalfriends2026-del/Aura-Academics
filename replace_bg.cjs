const fs = require('fs');
const path = require('path');

const walk = function(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

walk('./src/components', function(err, results) {
  if (err) throw err;
  results.filter(f => f.endsWith('.tsx')).forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const oldStr = 'bg-white dark:bg-slate-900';
    const newStr = 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-white/50 dark:border-slate-800/50';
    
    if (content.includes(oldStr)) {
        // Also need to carefully handle the border string if there's already border-slate-200 dark:border-slate-800
        content = content.replace(/bg-white dark:bg-slate-900/g, 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl');
        content = content.replace(/border-slate-200 dark:border-slate-800/g, 'border-white/50 dark:border-slate-800/50');
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
  });
});
