using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportsShopClients.Models;

namespace SportsShopClients.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly DataContext _context;

        public ClientsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Clients
        [HttpGet]
        public IEnumerable<Client> GetClient()
        {
			return _context.Client.Include("Telephone").Select(x => new Client() {
				CEP = x.CEP,
				Classification = x.Classification,
				Email = x.Email,
				Id = x.Id,
				Name = x.Name,
				SocialNumber = x.SocialNumber,
				TelephoneList = x.TelephoneList
			});
        }

        // GET: api/Clients/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetClient([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Client client = await _context.Client.Include("Telephone").Where(x => x.Id == id).Select(x => new Client()
			{
				CEP = x.CEP,
				Classification = x.Classification,
				Email = x.Email,
				Id = x.Id,
				Name = x.Name,
				SocialNumber = x.SocialNumber,
				TelephoneList = x.TelephoneList
			}).SingleOrDefaultAsync();

			if (client == null)
            {
                return NotFound();
            }

            return Ok(client);
        }

        // PUT: api/Clients/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClient([FromRoute] int id, [FromBody] Client client)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != client.Id)
            {
                return BadRequest();
            }

			for (int i = 0; i < client.TelephoneList.Count; i++)
			{
				client.TelephoneList[i].Id = null;
			}

			_context.Telephone.RemoveRange(_context.Telephone.Where(x => x.ClientId == id));
			_context.SaveChanges();
			_context.Telephone.AddRange(client.TelephoneList);
			_context.Entry(client).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Clients
        [HttpPost]
        public async Task<IActionResult> PostClient([FromBody] Client client)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

			client.Id = null;
			Client auxCl = new Client(){
				CEP = client.CEP,
				Classification = client.Classification,
				Email = client.Email,
				Id = null,
				Name = client.Name,
				SocialNumber = client.SocialNumber
			};
			_context.Client.Add(auxCl);
			_context.SaveChanges();

			client.TelephoneList = client.TelephoneList != null ? client.TelephoneList : new List<Telephone>();

			for (int i = 0; i < client.TelephoneList.Count; i++)
			{
				client.TelephoneList[i].ClientId = auxCl.Id.Value;
				client.TelephoneList[i].Id = null;
			}

			client.Id = auxCl.Id;

			_context.Telephone.AddRange(client.TelephoneList);

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (Exception e)
			{
				return null;
			}

			auxCl.TelephoneList = null;
			return CreatedAtAction("GetClient", new { id = auxCl.Id }, auxCl);
        }

        // DELETE: api/Clients/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var client = await _context.Client.FindAsync(id);
            if (client == null)
            {
                return NotFound();
            }

			_context.Telephone.RemoveRange(_context.Telephone.Where(x => x.ClientId == id));
			_context.Client.Remove(client);
            await _context.SaveChangesAsync();

            return Ok(client);
        }

        private bool ClientExists(int id)
        {
            return _context.Client.Any(e => e.Id == id);
        }
    }
}