using StoppingTutorials
using Test

file_path(file_name) = joinpath(@__DIR__,"..", "src", file_name)

@testset "StoppingTutorials.jl" begin
  # Should we test something here?
end

for (i,(title,filename)) in enumerate(StoppingTutorials.files)
  @testset "StoppingTutorials: test $(title)" begin
    include(file_path(filename))
  end
end
