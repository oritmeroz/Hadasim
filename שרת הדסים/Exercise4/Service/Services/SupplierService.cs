using AutoMapper;
using Repository.Entities;
using Repository.Interfaces;
using Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services
{
    public class SupplierService:ISupplierService
    {
        private readonly IRepository<Supplier> _repository;
        private readonly IMapper _mapper;

        public SupplierService(IRepository<Supplier> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public SupplierDto Add(SupplierDto item)
        {
            return _mapper.Map<SupplierDto>(_repository.Add(_mapper.Map<Supplier>(item)));
        }

        public SupplierDto Get(int id)
        {
            return _mapper.Map<SupplierDto>(_repository.Get(id));
        }

        public List<SupplierDto> GetAll()
        {
            return _mapper.Map<List<SupplierDto>>(_repository.GetAll());
        }
    }
}
