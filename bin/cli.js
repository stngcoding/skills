#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const os = require('os');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const CLAUDE_SKILLS_DIR = path.join(os.homedir(), '.claude', 'skills');

function listSkills() {
  if (!fs.existsSync(SKILLS_DIR)) {
    console.error('No skills directory found in package.');
    process.exit(1);
  }
  const skills = fs.readdirSync(SKILLS_DIR).filter(f =>
    fs.statSync(path.join(SKILLS_DIR, f)).isDirectory()
  );
  if (skills.length === 0) {
    console.log('No skills available.');
    return;
  }
  console.log('Available skills:');
  skills.forEach(s => console.log(`  - ${s}`));
}

function addSkill(skillName) {
  const src = path.join(SKILLS_DIR, skillName);
  if (!fs.existsSync(src)) {
    console.error(`Skill "${skillName}" not found.`);
    console.log('Run `skills list` to see available skills.');
    process.exit(1);
  }

  fs.mkdirSync(CLAUDE_SKILLS_DIR, { recursive: true });

  const dest = path.join(CLAUDE_SKILLS_DIR, skillName);
  fs.cpSync(src, dest, { recursive: true });
  console.log(`Installed "${skillName}" → ${dest}`);
}

const [,, command, ...args] = process.argv;

switch (command) {
  case 'add':
    if (!args[0]) {
      console.error('Usage: skills add <skill-name>');
      process.exit(1);
    }
    addSkill(args[0]);
    break;
  case 'list':
    listSkills();
    break;
  default:
    console.log('Usage:');
    console.log('  skills list              List available skills');
    console.log('  skills add <skill-name>  Install a skill to ~/.claude/skills/');
    break;
}
