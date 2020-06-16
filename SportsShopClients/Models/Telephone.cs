using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SportsShopClients.Models
{
	public class Telephone
	{
		public int? Id { get; set; }
		public int ClientId { get; set; }

		[Required(ErrorMessage = "Telephone number is a required field", AllowEmptyStrings = false)]
		[StringLength(50)]
		[Display(Name = "Telephone number")]
		public string Number { get; set; }

		public Client TelCli { get; set; }
	}
}
