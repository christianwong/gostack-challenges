Steps to merge resolution project to this repo.

### Add and merge the repository
1. git pull
1. git remote add -f gostack-fundamentos-reactjs https://github.com/christianwong/gostack-fundamentos-reactjs.git
1. git merge gostack-fundamentos-reactjs/master --allow-unrelated-histories

### Move files to subfolder
1. mkdir fundamentos-reactjs
1. ls -a
1. mv .e* .gitignore config-overrides.js jest.config.js package.json prettier.config.js public src tsconfig.json yarn.lock fundamentos-reactjs

### Commit
1. git add .
1. git commit -m "fundamentos-reactjs"
1. git push origin master
