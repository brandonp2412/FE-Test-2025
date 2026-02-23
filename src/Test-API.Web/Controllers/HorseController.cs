using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace Test_API.Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HorseController : ControllerBase
    {
        private readonly IHorsePersistence _horsePersistence;

        public HorseController(IHorsePersistence horsePersistence)
        {
            _horsePersistence = horsePersistence;
        }

        [HttpGet()]
        public ActionResult<IReadOnlyCollection<HorseStats>> Get()
        {
            var allHorses = _horsePersistence.GetAllHorses();

            return Ok(allHorses);
        }
        
        [HttpGet("{id}")]
        public ActionResult<HorseStats> Get(Guid id)
        {
            try
            {
                var horse = _horsePersistence.GetHorse(id);
                return horse;
            }
            catch (Exception e)
            {
                return NotFound();
            }
        }

        [HttpPut("{id}")]
        public ActionResult<HorseStats> UpdateHorse(Guid id, [FromBody] HorseStats newHorse)
        {
            try
            {
                if (!newHorse.IsValid(out string errorMessage))
                    return BadRequest(errorMessage);

                newHorse.Id = id;
                _horsePersistence.UpdateHorse(newHorse);
                return Ok(newHorse);
            }
            catch (Exception)
            {
                return NotFound();
            }
        }

        [HttpPut()]
        public ActionResult<Guid> AddHorse([FromBody] HorseStats newHorse)
        {
            if (!newHorse.IsValid(out string errorMessage))
                return BadRequest(errorMessage);
            
            var horseId = _horsePersistence.AddHorse(newHorse);
            return horseId;
        }
    }

    public class InMemoryHorsePersistence : IHorsePersistence
    {
        private readonly Dictionary<Guid, HorseStats> _horses = new Dictionary<Guid, HorseStats>();

        public InMemoryHorsePersistence()
        {
            AddHorse(new HorseStats("Thunderdash", "Hot Chips", 200d, 450d));
            AddHorse(new HorseStats("Artax", "Carrots", 198.99d, 400d));
            AddHorse(new HorseStats("Potoooooooo", "Potatoes", 205.44d, 423.44d));
            AddHorse(new HorseStats("Shorty", "Kebabs", 180.66d, 500.23d));
        }
        
        public HorseStats GetHorse(Guid id)
        {
            if (_horses.TryGetValue(id, out HorseStats horse))
                return horse;
            
            throw new Exception($"Could not find horse {id.ToString()}");
        }

        public IReadOnlyCollection<HorseStats> GetAllHorses()
        {
            return _horses.Values.ToList();
        }

        public void UpdateHorse(HorseStats newStats)
        {
            if (!_horses.ContainsKey(newStats.Id)) 
                throw new Exception($"Could not find horse {newStats.Id.ToString()}");
            
            _horses[newStats.Id] = newStats;
        }

        public Guid AddHorse(HorseStats newHorse)
        {
            var horseId = Guid.NewGuid();

            newHorse.Id = horseId;
            
            _horses.Add(horseId, newHorse);

            return horseId;
        }
    }

    public interface IHorsePersistence
    {
        HorseStats GetHorse(Guid id);
        void UpdateHorse(HorseStats newStats);
        Guid AddHorse(HorseStats newHorse);
        IReadOnlyCollection<HorseStats> GetAllHorses();
    }
}