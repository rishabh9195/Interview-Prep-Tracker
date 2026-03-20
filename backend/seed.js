const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

const questions = [
  // Arrays
  { title: 'Two Sum', topic: 'Arrays', difficulty: 'Easy', link: 'https://leetcode.com/problems/two-sum/' },
  { title: 'Best Time to Buy and Sell Stock', topic: 'Arrays', difficulty: 'Easy', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
  { title: 'Maximum Subarray', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/maximum-subarray/' },
  { title: 'Container With Most Water', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/container-with-most-water/' },
  // Strings
  { title: 'Valid Anagram', topic: 'Strings', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-anagram/' },
  { title: 'Valid Palindrome', topic: 'Strings', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-palindrome/' },
  { title: 'Longest Substring Without Repeating Characters', topic: 'Strings', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
  // Linked Lists
  { title: 'Reverse Linked List', topic: 'Linked Lists', difficulty: 'Easy', link: 'https://leetcode.com/problems/reverse-linked-list/' },
  { title: 'Merge Two Sorted Lists', topic: 'Linked Lists', difficulty: 'Easy', link: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
  { title: 'Linked List Cycle', topic: 'Linked Lists', difficulty: 'Easy', link: 'https://leetcode.com/problems/linked-list-cycle/' },
  // Trees
  { title: 'Maximum Depth of Binary Tree', topic: 'Trees', difficulty: 'Easy', link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
  { title: 'Invert Binary Tree', topic: 'Trees', difficulty: 'Easy', link: 'https://leetcode.com/problems/invert-binary-tree/' },
  { title: 'Binary Tree Level Order Traversal', topic: 'Trees', difficulty: 'Medium', link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
  // Dynamic Programming
  { title: 'Climbing Stairs', topic: 'Dynamic Programming', difficulty: 'Easy', link: 'https://leetcode.com/problems/climbing-stairs/' },
  { title: 'House Robber', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/house-robber/' },
  { title: 'Coin Change', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/coin-change/' },
  // Graphs
  { title: 'Number of Islands', topic: 'Graphs', difficulty: 'Medium', link: 'https://leetcode.com/problems/number-of-islands/' },
  { title: 'Clone Graph', topic: 'Graphs', difficulty: 'Medium', link: 'https://leetcode.com/problems/clone-graph/' },
  { title: 'Course Schedule', topic: 'Graphs', difficulty: 'Medium', link: 'https://leetcode.com/problems/course-schedule/' },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected!');
    await Question.deleteMany({});
    await Question.insertMany(questions);
    console.log('✅ 19 Questions added to database!');
    process.exit();
  })
  .catch((err) => console.log(err));