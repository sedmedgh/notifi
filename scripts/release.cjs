#!/usr/bin/env node
const { execSync } = require('child_process')
const path = require('path')
const readline = require('readline')
const fs = require('fs')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function questionAsync(query) {
  return new Promise((resolve) => rl.question(query, resolve))
}

function findPackageJson(startDir = process.cwd()) {
  let dir = startDir
  while (dir !== path.parse(dir).root) {
    const pkgPath = path.join(dir, 'package.json')
    if (fs.existsSync(pkgPath)) {
      return pkgPath
    }
    dir = path.dirname(dir)
  }
  throw new Error('❌ No package.json found in current or parent directories!')
}

async function main() {
  try {
    const pkgPath = findPackageJson()
    const pkgDir = path.dirname(pkgPath)
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))

    console.log(`📦 Releasing: ${pkg.name} (${pkg.version})`)

    const bumpTypeInput = await questionAsync('Enter bump type (patch/minor/major) [patch]: ')
    const bumpType = bumpTypeInput.trim() || 'patch'

    const commitMessage = await questionAsync('Enter commit message: ')
    if (!commitMessage.trim()) {
      throw new Error('Commit message cannot be empty!')
    }

    console.log(`📈 Bumping version (${bumpType})...`)
    execSync(`npm version ${bumpType} --no-git-tag-version`, {
      stdio: 'inherit',
      cwd: pkgDir,
    })

    console.log('📝 Committing changes...')
    execSync('git add -A', { stdio: 'inherit' })
    execSync(`git commit -m "${commitMessage}"`, {
      stdio: 'inherit',
    })

    const newPkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    const newVersion = newPkg.version

    console.log(`🏷 Tagging (v${newVersion})...`)
    execSync(`git tag ${pkg.name}@${newVersion}`, {
      stdio: 'inherit',
    })

    console.log('🚀 Pushing to Git...')
    execSync('git push origin main', { stdio: 'inherit' })
    execSync(`git push origin ${pkg.name}@${newVersion}`, {
      stdio: 'inherit',
    })

    console.log('📦 Publishing to npm...')
    execSync('npm publish', { stdio: 'inherit', cwd: pkgDir })

    console.log('✅ Release successful!')
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  } finally {
    rl.close()
  }
}

main()
