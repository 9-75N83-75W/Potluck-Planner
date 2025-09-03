# Potluck-Planner 🍽️
A web app designed to help make potlucks safer and more inclusive by tagging dishes and notifying participants of food allergens & dietary restrictions.

<table>
  <tr>
    <td style="text-align: center;"><strong>  Meet the Team! </td>
  </tr>
  <tr>
    <td>Zahra Udaipurwala</td>   
  </tr>
  <tr>
     <td>Ariel Zolton</td>
  </tr>
  <tr>
     <td>Evans Berrocal</td>
  </tr>
  <tr>
     <td>Immaculate Chukwuemeka</td>
  </tr>
</table>

---
## 🎯 Our Purpose:
This project grew from our love of sharing meals together and the challenges food allergies can bring to those moments. With several team members personally affected by allergens and dietary constraints, we set out to create a safer, more inclusive experience. In doing so, we tried to take the guesswork out of which dish contains which ingredients, by tagging relevant allergens or dietary information on each dish for the users. Meanwhile, hosts have all this information about attendees organized and can adequately accommodate for guests.

---
##  📌 Core Features:
  * Create profile and store list of food constraints.
     * Categorized by severity --> airborne allergens, dietary allergens, dietary restrictions, and preferences
     * Events and new recipe forms are automatically populated with any allergens or restrictions present amongst accepted attendees
  * Create & join potluck events
     * Ability to send out / accept invitations with RSVP dates, description, contact info, location, etc.
  * Add dishes with ingredients list
     * Tag dish with any dietary allergens or dietary restrictions from a pre-populated list from any constraints amongst attendees  
  * Color-coded tags for dishes with any dietary allergen or adhering to any dietary restrictions (to notify guests of any risks)
      * Allows attendees to easily see which dishes they can have or need to avoid    

----
## 🛠️ Tech Stack:   
- Mock-Up: Figma  
- Front End: React  
- Back End: Node.js
- Database: MongoDB
    - The flexibility to change and workout our schema made this a great option, as there is various information we store, related to the user, events, recipes, etc. We had to trial and error the best way to organize the data, thus this was easiest to develop with and maintain.
- Presentation: https://potluck-planner.my.canva.site/
- LinkTree: https://linktr.ee/PotluckPlanner

---
## 🗄️ Backend Structure:
  * Food Constraints are stored separately, and referenced in User. It's designed so that each time a profile is created, and restriction are inputed, the constraint and it's category (ie airborne, dietary allergy, dietary restriction, likes, or dislikes) is assigned. If the constraint and category exist in database, from another user, it will reference them. Else it will create a new constraint. This way, the constraints are more controlled and there are no duplicates.

---
## ⚠️ Safety Features:
  * Constraints are categorized by severity of risk, ranging from airborne allergens, dietary allergens, dietary restrictions, and likes/dislikes
  * Airborne allergens cannot be present at event given the severe risk they pose to any guest(s)
      * As such, if an airborne allergen is selected in the new recipe form, there is an alert message & submit button is disabled until that ingredient is removed.
  * Dietary allergens and dietary restrictions are tagged with yellow and green labels. While they can be brought to an event, guests are notified which dishes contain allergens.

---
## 🤖 Future Implementations:    
  * Barcode API Integration – Streamline ingredient entry, accounts for allergens present in any premade / store-bought ingredients
  * Derivative Allergy Detection – Identify hidden allergens, promote utmost safety
  * Dish Image Uploads – Add photos for clarity & appeal
  * Allergy-Specific Reminders – Notify guests on event day of what items to be mindful of / what are safe to consume based on their dietary constraints
  * Recipe Library Expansion – Curated, accessible options
  * External Invite Messaging – Seamless guest communication, out of app invites / notifications
  * Deployment Readiness – Stable, scalable rollout
  * Recipe Suggestion API Wrapper – Intelligent recipe recommendations based on dietary constraints and/or preferences, perfect to find a recipe that everyone can enjoy or for picky eaters (like kids)

---





