using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SportsShopClients.Models
{
	public class Client
	{
		public int? Id { get; set; }

		[Required(ErrorMessage = "Name is a required field", AllowEmptyStrings = false)]
		[StringLength(100)]
		[Display(Name = "Name")]
		public string Name { get; set; }

		[StringLength(100)]
		[Display(Name = "Social number (CPF/CNPJ)")]
		public string SocialNumber { get; set; }

		[StringLength(10)]
		[Display(Name = "CEP")]
		public string CEP { get; set; }

		[Required(ErrorMessage = "Email is a required field", AllowEmptyStrings = false)]
		[RegularExpression(".+\\@.+\\..+", ErrorMessage = "Please insert a valid email...")]
		[Display(Name = "E-Mail")]
		[StringLength(100)]
		public string Email { get; set; }

		[Required(ErrorMessage = "Classification is a required field", AllowEmptyStrings = false)]
		[StringLength(50)]
		[Display(Name = "Classification")]
		public string Classification { get; set; }

		public List<Telephone> TelephoneList { get; set; }
	}
}
