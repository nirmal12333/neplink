// Simple in-memory database for demonstration purposes
// This is not suitable for production use

class InMemoryDatabase {
  constructor() {
    this.data = {
      users: [],
      news: [],
      marketplace: [],
      jobs: [],
      rentals: []
    };
    this.idCounter = 1;
  }

  // Generate unique ID
  generateId() {
    return this.idCounter++;
  }

  // Users
  createUser(userData) {
    const user = {
      id: this.generateId(),
      ...userData,
      date: new Date()
    };
    this.data.users.push(user);
    return user;
  }

  findUserByEmail(email) {
    return this.data.users.find(user => user.email === email);
  }

  findUserById(id) {
    return this.data.users.find(user => user.id === id);
  }

  // News
  createNews(newsData) {
    const news = {
      id: this.generateId(),
      ...newsData,
      date: new Date(),
      published: newsData.published || false
    };
    this.data.news.push(news);
    return news;
  }

  getAllNews() {
    return this.data.news.filter(item => item.published);
  }

  getAllNewsAdmin() {
    return this.data.news;
  }

  getNewsById(id) {
    return this.data.news.find(item => item.id == id);
  }

  updateNews(id, updateData) {
    const index = this.data.news.findIndex(item => item.id == id);
    if (index !== -1) {
      this.data.news[index] = { ...this.data.news[index], ...updateData };
      return this.data.news[index];
    }
    return null;
  }

  deleteNews(id) {
    const index = this.data.news.findIndex(item => item.id == id);
    if (index !== -1) {
      this.data.news.splice(index, 1);
      return true;
    }
    return false;
  }

  // Marketplace
  createMarketplaceItem(itemData) {
    const item = {
      id: this.generateId(),
      ...itemData,
      date: new Date(),
      available: itemData.available || true
    };
    this.data.marketplace.push(item);
    return item;
  }

  getAllMarketplaceItems() {
    return this.data.marketplace.filter(item => item.available);
  }

  getAllMarketplaceItemsAdmin() {
    return this.data.marketplace;
  }

  getMarketplaceItemById(id) {
    return this.data.marketplace.find(item => item.id == id);
  }

  updateMarketplaceItem(id, updateData) {
    const index = this.data.marketplace.findIndex(item => item.id == id);
    if (index !== -1) {
      this.data.marketplace[index] = { ...this.data.marketplace[index], ...updateData };
      return this.data.marketplace[index];
    }
    return null;
  }

  deleteMarketplaceItem(id) {
    const index = this.data.marketplace.findIndex(item => item.id == id);
    if (index !== -1) {
      this.data.marketplace.splice(index, 1);
      return true;
    }
    return false;
  }

  // Jobs
  createJob(jobData) {
    const job = {
      id: this.generateId(),
      ...jobData,
      date: new Date(),
      active: jobData.active || true
    };
    this.data.jobs.push(job);
    return job;
  }

  getAllJobs() {
    return this.data.jobs.filter(job => job.active);
  }

  getAllJobsAdmin() {
    return this.data.jobs;
  }

  getJobById(id) {
    return this.data.jobs.find(job => job.id == id);
  }

  updateJob(id, updateData) {
    const index = this.data.jobs.findIndex(job => job.id == id);
    if (index !== -1) {
      this.data.jobs[index] = { ...this.data.jobs[index], ...updateData };
      return this.data.jobs[index];
    }
    return null;
  }

  deleteJob(id) {
    const index = this.data.jobs.findIndex(job => job.id == id);
    if (index !== -1) {
      this.data.jobs.splice(index, 1);
      return true;
    }
    return false;
  }

  // Rentals
  createRental(rentalData) {
    const rental = {
      id: this.generateId(),
      ...rentalData,
      date: new Date(),
      available: rentalData.available || true
    };
    this.data.rentals.push(rental);
    return rental;
  }

  getAllRentals() {
    return this.data.rentals.filter(rental => rental.available);
  }

  getAllRentalsAdmin() {
    return this.data.rentals;
  }

  getRentalById(id) {
    return this.data.rentals.find(rental => rental.id == id);
  }

  updateRental(id, updateData) {
    const index = this.data.rentals.findIndex(rental => rental.id == id);
    if (index !== -1) {
      this.data.rentals[index] = { ...this.data.rentals[index], ...updateData };
      return this.data.rentals[index];
    }
    return null;
  }

  deleteRental(id) {
    const index = this.data.rentals.findIndex(rental => rental.id == id);
    if (index !== -1) {
      this.data.rentals.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Create and export a single instance
const db = new InMemoryDatabase();
module.exports = db;