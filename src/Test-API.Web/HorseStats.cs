using System;

namespace Test_API.Web
{
    public class HorseStats
    {
        public HorseStats()
        {
            
        }

        public HorseStats(string name, string favouriteFood = null, double? height = null, double? weight = null)
        {
            Name = name;
            Profile = new HorseProfile(){
                FavouriteFood = favouriteFood, 
                Physical = new PhysicalProfile()
                {
                    Height = height,
                    Weight = weight
                }
            };
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public HorseProfile Profile { get; set; }

        public bool IsValid(out string errorMessage)
        {
            errorMessage = null;
            if (string.IsNullOrEmpty(Name))
            {
                errorMessage = "Must provide a name";
                return false;
            }
            return true;
        }
    }

    public class HorseProfile
    {
        public string FavouriteFood { get; set; }
        public PhysicalProfile Physical { get; set; }
    }

    public class PhysicalProfile
    {
        public double? Height { get; set; }
        public double? Weight { get; set; }
    }
}